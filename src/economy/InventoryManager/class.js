const InventoryItem = require("../../models/inventory");
const ShopItem = require("../../types/ShopItems");
require("dotenv").config();
class InventorySystem {
  constructor() {
    this.shop = [
      { name: "boot", price: 100, amount: 1 },
      { name: "hat", price: 50, amount: 1 },
      { name: "shirt", price: 75, amount: 1 },
      { name: "pants", price: 80, amount: 1 },
      { name: "gloves", price: 30, amount: 1 },
      { name: "scarf", price: 40, amount: 1 },
      { name: "jacket", price: 120, amount: 1 },
      { name: "sweater", price: 90, amount: 1 },
      { name: "socks", price: 20, amount: 1 },
      { name: "shoes", price: 110, amount: 1 },
      { name: "belt", price: 60, amount: 1 },
      { name: "tie", price: 45, amount: 1 },
      { name: "watch", price: 200, amount: 1 },
      { name: "glasses", price: 150, amount: 1 },
      { name: "ring", price: 250, amount: 1 },
      { name: "necklace", price: 300, amount: 1 },
      { name: "bracelet", price: 180, amount: 1 },
      { name: "earrings", price: 220, amount: 1 },
      { name: "bag", price: 130, amount: 1 },
      { name: "backpack", price: 140, amount: 1 },
      { name: "wallet", price: 70, amount: 1 },
      { name: "umbrella", price: 35, amount: 1 },
      { name: "headphones", price: 160, amount: 1 },
      { name: "phone", price: 800, amount: 1 },
      { name: "laptop", price: 1000, amount: 1 },
      { name: "mouse", price: 65, amount: 1 },
      { name: "keyboard", price: 85, amount: 1 },
      { name: "monitor", price: 300, amount: 1 },
      { name: "printer", price: 200, amount: 1 },
      { name: "speaker", price: 170, amount: 1 },
    ];
    this.addShopItems();
  }
  // Function to get a user's inventory
  async getInventory(userId) {
    try {
      const inventory = await InventoryItem.find({ userId: userId });
      if (inventory) {
        return inventory;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting inventory:", error);
      return [];
    }
  }

  /**
   * Retrieves the shop.
   *
   * @return {ShopItem[]} the shop
   */
  getShop() {
    return this.shop;
  }

  async addShopItems() {
    try {
      const userId = process.env.CLIENT_ID;

      for (const item of this.shop) {
        // Check if the item already exists for the user
        const existingItem = await InventoryItem.findOne({
          userId: userId,
          name: item.name,
        });

        if (existingItem) {
          // Item exists, update the amount
          existingItem.amount += item.amount * 1000;
          await existingItem.save();
          continue;
        } else {
          // If the item doesn't exist, proceed to add it
          const newItem = new InventoryItem({
            userId: userId,
            itemId: this.generateItemId(),
            name: item.name,
            amount: item.amount * 1000,
            price: item.price,
          });
          await newItem.save();
        }
      }
      return true;
    } catch (error) {
      console.error("Error adding/updating shop items in inventory:", error);
      return false;
    }
  }

  async getShopItemInfo(name) {
    for (const item of this.shop) {
      if (item.name === name) {
        return item;
      }
    }
  }

  getItemInfo(item) {
    return InventoryItem.findOne({ name: item });
  }
  // Function to add an item to a user's inventory
  async addItem(userId, item) {
    try {
      // Check if the item already exists for the user
      const existingItem = await InventoryItem.findOne({
        userId,
        name: item.name,
      }).exec();

      if (existingItem) {
        // Item exists, update the amount
        existingItem.amount += item.amount;
        await existingItem.save();
        return true;
      }

      // If the item doesn't exist, proceed to add it
      const newItem = new InventoryItem({
        userId,
        itemId: this.generateItemId(),
        name: item.name,
        amount: item.amount,
        price: item.price,
      });

      await newItem.save();
      return true;
    } catch (error) {
      console.error("Error adding/updating item in inventory:", error);
      return false;
    }
  }

  // Function to sell an item from a user's inventory
  async sellItem(userId, itemId, amount = 1) {
    try {
      const item = await InventoryItem.findOne({ userId, itemId });
      if (!item) {
        return false; // Item not found in the inventory
      }

      if (item.amount < amount) {
        return false; // Not enough quantity to sell
      }

      item.amount -= amount;
      if (item.amount === 0) {
        await item.remove();
      } else {
        await item.save();
      }

      console.log("Item sold from inventory:", item);
      return true;
    } catch (error) {
      console.error("Error selling item from inventory:", error);
      return false;
    }
  }

  findUser(userId) {
    return InventoryItem.findOne({ userId: userId });
  }

  // Function to buy an item and add it to a user's inventory
  // Function to buy an item and add it to a user's inventory
  async buyItem(userId, sellerId, item, amount = 1) {
    try {
      // Check if the item is available in the seller's inventory
      const sellerInventory = await InventoryItem.findOne({ userId: sellerId, name: item.name });
      if (!sellerInventory) {
        return false; // Item not found in the seller's inventory
      }

      const sellerItem = sellerInventory;

      // Check if the seller has enough quantity to sell
      if (sellerItem.amount < amount) {
        return false; // Not enough quantity available for purchase
      }

      // Check if the buyer already has the item in their inventory
      const buyerInventory = await InventoryItem.findOne({ userId, name: item.name });

      if (buyerInventory) {
        // Increment the amount if the buyer already has the item
        buyerInventory.amount += amount;
        await buyerInventory.save();
      } else {
        // Add the item to the buyer's inventory if not already present
        await this.addItem(userId, item, amount);
      }

      // Deduct the sold items from the seller's inventory
      sellerItem.amount -= amount;

      if (sellerItem.amount === 0) {
        // Remove the item if the quantity becomes zero
        await sellerItem.remove();
      } else {
        // Save the updated seller's item
        await sellerItem.save();
      }
      return true;
    } catch (error) {
      console.error("Error buying item:", error);
      return false;
    }
  }
  getRandomIndex(probabilities) {
    const total = probabilities.reduce((acc, curr) => acc + curr, 0);
    const random = Math.random() * total;
    for (let i = 0; i < probabilities.length; i++) {
      if (random < probabilities[i]) {
        return i;
      }
      random -= probabilities[i];
    }
    return probabilities.length - 1;
  }

  // Function to gamble for an item
  async gambleItem(userId, uitem) {
    try {
      const items = Object.keys(this.gamblingData);
      if (items.length === 0) {
        return false; // No items available for gambling
      }

      const probabilities = items.map(item => this.gamblingData[item]);
      const itemIndex = this.getRandomIndex(probabilities);
      const selectedItem = items[itemIndex];

      const newItem = new InventoryItem({
        userId,
        itemId: this.generateItemId(),
        name: selectedItem,
        amount: 1,
        price: 1000,
      });

      if (newItem.name === uitem) {
        return false;
      }

      await newItem.save();
      console.log("Item won from gambling:", newItem);
      return newItem;
    } catch (error) {
      console.error("Error gambling item:", error);
      return false;
    }
  }

  // Function to generate a unique item ID
  generateItemId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
  }

  // Function to save a user with default items
  async saveUserWithDefaultItems(userId) {
    const defaultItems = [
      {
        name: "Bread",
        amount: 10,
        price: 1,
      },
      {
        name: "Milk",
        amount: 10,
        price: 1,
      },
    ];
    try {
      const existingInventory = await InventoryItem.find({ userId }).exec();
      if (existingInventory.length > 0) {
        return false;
      } else {
        for (const item of defaultItems) {
          await this.addItem(userId, item);
        }
      }
    } catch (error) {
      console.error("Error saving user with default items:", error);
      return false;
    }
  }
}

module.exports = { InventorySystem };
