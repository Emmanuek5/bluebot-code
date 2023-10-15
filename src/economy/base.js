require("dotenv").config();
class Economy {
  constructor() {
    this.db = require("../models/economy");
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
    const data = this.db.create({
      Guild: guild,
      User: user,
      Wallet: this.startingbalance,
      Bank: 0,
    });
    if (!data) return false;
    if (inv.findUser(user)) return false;
    inv.saveUserWithDefaultItems(user, this.defaultItems);
    return data;
  }

  findUser(user) {
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();

    const data = this.db.findOne({ User: user });
    if (!data) return false;
    inv.saveUserWithDefaultItems(user, this.defaultUser);
    return data;
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

      return shopItemInfo;
    } catch (error) {
      console.log(error);
      return "An error occurred during the purchase";
    }
  }
}

module.exports = { Economy };
