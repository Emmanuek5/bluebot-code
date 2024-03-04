require("dotenv").config();
const ecoSChema = require("../models/economy");
const EconomyUser = require("../types/EconomyUser");
const WorkH = require("./WorkSystem/class");

class Economy {
  constructor() {
    this.db = ecoSChema;
    this.startingbalance = 1000;
    this.maxbalance = 100000000;
    this.minbalance = 0;
    this.minbet = 10;
    this.maxbet = 10000;
    this.maxitems = 1000;
    this.getshopid = process.env.CLIENT_ID;
    this.minitems = 1;
    this.defaultItems = { name: "boot", price: 100, amount: 1 };
    this.WorkSystem = new WorkH();
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

  async create(user, guild) {
    const { InventorySystem } = require("./InventoryManager/class");
    let inv = new InventorySystem();

    // Check if the user already exists
    const existingUser = this.findUser(user);
    if (existingUser) {
      console.log("User already exists:");
      return false;
    }

    // Create a new entry
    const data = await this.db.create({
      Guild: guild,
      User: user,
      Wallet: this.startingbalance,
      Bank: 0,
    });

    if (!data) return false;
    if (inv.findUser(user)) return false;
    await inv.saveUserWithDefaultItems(user, this.defaultItems);
    return data;
  }

  async createDefaultUser() {
    const { InventorySystem } = require("./InventoryManager/class");
    const mainShopUserId = process.env.CLIENT_ID; // Assuming CLIENT_ID is the main shop's user ID

    // Check if the main shop user already exists
    const existingMainShopUser = await ecoSChema.findOne({ User: mainShopUserId }).exec();

    if (existingMainShopUser) {
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

  async findUser(user) {
    const data = await this.db.findOne({ User: user });
    if (data) {
      const user = new EconomyUser();
      user.id = data.User;
      user.Wallet = data.Wallet;
      user.Bank = data.Bank;
      user.total = data.Wallet + data.Bank;
      user.inventory = await this.getUserItems(user.id);
      user.MongoData = data;

      return user;
    } else {
      return null;
    }
  }

  async work(user, jobName) {
    try {
      // Hire the worker for the specified job
      const result = await this.WorkSystem.hireWorker({ name: user.username }, jobName);

      if (Array.isArray(result)) {
        return result;
      }

      const job = this.WorkSystem.getJob(jobName);

      // Check if the worker was hired successfully

      await this.addMoney(user.id, job.salary);
      await this.removeMoney(job.employer, job.salary);

      // Return some message indicating job completion and payment
      return `Job ${jobName} completed by ${user.username}. You earned $${job.salary} .`;
    } catch (error) {
      console.error("Error during work:", error);
      return [false, error];
    }
  }

  async getBalance(user) {
    const data = await this.db.findOne({ User: user }).exec();
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

  async addMoney(user, amount) {
    try {
      // Use findOne() from the Mongoose model instance
      const data = await this.db.findOne({ User: user }).exec();
      if (!data) {
        return false;
      }

      data.Wallet += amount;
      await data.save();

      return data;
    } catch (error) {
      console.error("Error adding money:", error);
      return false;
    }
  }

  async removeMoney(user, amount) {
    const data = await this.db.findOne({ User: user }).exec();

    if (!data) return false;

    // Check if data.Bank is already NaN
    if (isNaN(data.Bank)) return false;

    // Check if amount is a valid number
    if (isNaN(amount) || !isFinite(amount)) return false;

    // Ensure data.Bank is a number
    data.Bank = Number(data.Bank);

    // Check if there's enough money in the wallet
    if (data.Wallet < amount) {
      // If wallet balance is insufficient, deduct the remaining amount from the bank
      const remainingAmount = amount - data.Wallet;
      data.Wallet = 0; // Set wallet balance to 0
      data.Bank -= remainingAmount; // Deduct remaining amount from bank
    } else {
      // If wallet balance is sufficient, deduct the amount directly from the wallet
      data.Wallet -= amount;
    }

    // Save the updated data
    await data.save();

    return data;
  }

  async getUserItems(user) {
    const data = await this.InventorySystem.getInventory(user);
    return data;
  }

  async gamble(user, amount) {
    // Generate a random number to simulate the gambling outcome
    const randomNumber = Math.random();
    const multiplier = 2;

    // Assuming 50% chance of winning
    const winProbability = 0.5;

    if (randomNumber < winProbability) {
      // If the random number is less than the win probability, the user wins
      const winnings = amount * multiplier; // Double the amount as winnings
      await this.addMoney(user, winnings); // Add the winnings to the user's balance
      return `Congratulations! You won $${winnings} with a multiplier of ${multiplier}!`;
    } else {
      // If the random number is greater than or equal to the win probability, the user loses
      await this.removeMoney(user, amount); // Deduct the gambling amount from the user's balance
      return "Sorry, you lost. Better luck next time!";
    }
  }

  async buyItemfromShop(user, item, amount) {
    try {
      // Check if the item exists in the shop (modify this based on your actual logic)
      const shopItemInfo = await this.InventorySystem.getShopItemInfo(item);
      if (!shopItemInfo) return "Item not found in the shop";

      // Check if the user has sufficient funds
      const userBalance = await this.getBalance(user);
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

  getShop() {
    return this.InventorySystem.getShop();
  }
}

module.exports = { Economy };
