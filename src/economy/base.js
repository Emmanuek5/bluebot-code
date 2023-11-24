require("dotenv").config();
const eco = require("../models/economy");
class Economy {
  constructor() {
    this.db = eco;
    this.startingbalance = 1000;
    this.maxbalance = 100000000;
    this.minbalance = 0;
    this.minbet = 10;
    this.maxbet = 10000;
    this.maxitems = 1000;
    this.getshopid = process.env.CLIENT_ID;
    this.minitems = 1;
    this.defaultItems = { name: "boot", price: 100, amount: 1 };
    this.InventorHandler = require("./InventoryManager/class");
    this.InventorySystem = new this.InventorHandler.InventorySystem();
    this.createDefaultUser();
  }

  /**
   *
   * @param {String} user
   * @param {String} guild
   *
   * The User and Guild are both strings and the IDs
   */

  create(user, guild) {
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();

    // Check if the user already exists
    const existingUser = this.findUser(user);
    if (existingUser) {
      console.log("User already exists:");
      return false;
    }

    // Create a new entry
    const data = this.db.create({
      Guild: guild,
      User: user,
      Wallet: this.startingbalance,
      Bank: 0,
    });

    console.log("User created:");

    if (!data) return false;
    if (inv.findUser(user)) return false;
    inv.saveUserWithDefaultItems(user, this.defaultItems);
    return data;
  }

  createDefaultUser() {
    const { InventorySystem } = require("./InventoryManager/class");
    const mainShopUserId = process.env.CLIENT_ID; // Assuming CLIENT_ID is the main shop's user ID
    // Check if the main shop user already exists
    const existingMainShopUser = this.db.findOne({ User: mainShopUserId });
    if (existingMainShopUser) {
      console.log("Main shop user already exists:");
      return false;
    }
    // Create the main shop user with default values
    const mainShopUserData = this.db.create({
      Guild: process.env.DEV_GUILD_ID, // You may set this to the main shop's guild ID if needed
      User: mainShopUserId,
      Wallet: this.startingbalance,
      Bank: 0,
    });
    console.log("Main shop user created:");

    if (!mainShopUserData) return false;
    return mainShopUserData;
  }

  findUser(user) {
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();

    // Find the user
    const data = this.db.findOne({ User: user });

    if (data) {
      console.log("User found");
      return data;
    } else {
      console.log("User not found");
      return null;
    }
  }

  getBalance(user) {
    const data = this.db.findOne({ User: user });
    if (!data) return false;
    return data.Wallet + data.Bank;
  }
  updateBalance(user, guild, amount) {
    const data = this.db.findOne({ User: user });
    if (!data) return false;
    data.Wallet += amount;
    data.save();
    return data;
  }

  setBalance(user, guild, amount) {
    const data = this.db.findOne({ User: user });
    if (!data) return false;
    data.Wallet = amount;
    data.save();
    return data;
  }

  addMoney(user, guild, amount) {
    const data = this.db.findOne({ User: user });
    if (!data) return false;
    data.Bank += amount;
    data.save();
    return data;
  }

  async removeMoney(user, amount) {
    const data = await this.db.findOne({ User: user });
    console.log(data);
    if (!data) return false;

    // Check if data.Wallet is already NaN
    if (isNaN(data.Wallet)) return false;

    // Check if amount is a valid number
    if (isNaN(amount) || !isFinite(amount)) return false;

    // Ensure data.Wallet is a number
    data.Wallet = Number(data.Wallet);

    // Check if there's enough money
    if (data.Wallet < amount) return false;

    // Subtract amount from Wallet
    console.log(data.Wallet);
    data.Wallet -= amount;
    console.log(data.Wallet);

    // Save the updated data
    await data.save();

    return data;
  }

  async getUserItems(user) {
    const data = await this.InventorySystem.getInventory(user);
    return data;
  }

  gable(user, item, amount) {
    const gamble = this.InventorySystem.gambleItem(user);
    if (!gamble) {
      this.removeMoney(user, amount);
      return false;
    }
    return gamble;
  }

  async buyItemfromShop(user, item, amount) {
    try {
      // Check if the item exists in the shop (modify this based on your actual logic)
      const shopItemInfo = await this.InventorySystem.getShopItemInfo(item);
      if (!shopItemInfo) return "Item not found in the shop";

      // Check if the user has sufficient funds
      const userBalance = this.getBalance(user);
      if (userBalance < shopItemInfo.price * amount) return "Insufficient Funds";

      // Remove money from the user
      await this.removeMoney(user, shopItemInfo.price * amount);

      // Buy the item from the shop
      this.InventorySystem.buyItem(user, process.env.CLIENT_ID, shopItemInfo, amount);
      await this.addMoney(process.env.CLIENT_ID, shopItemInfo.price * amount);

      return shopItemInfo;
    } catch (error) {
      console.log(error);
      return "An error occurred during the purchase";
    }
  }
}

module.exports = { Economy };
