const InventoryItem = require("../../models/inventory");
const {Economy} = require("../base")
class InventorySystem extends Economy {
  constructor() {
   super()
  }

  // Function to get a user's inventory
  async getInventory(userId) {
    console.log("Getting inventory for user:", userId);
    try {
      const inventory = await InventoryItem.find({ userId });
      return inventory;
    } catch (error) {
      console.error("Error getting inventory:", error);
      return [];
    }
  }

  // Function to add an item to a user's inventory
  async addItem(userId, item) {
    try {
      const newItem = new InventoryItem({
        userId,
        itemId: this.generateItemId(),
        name: item.name,
        amount: item.amount,
        price: item.price,
      });

      await newItem.save();
      console.log("Item added to inventory:", newItem);
      return true;
    } catch (error) {
      console.error("Error adding item to inventory:", error);
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

  // Function to buy an item and add it to a user's inventory
  async buyItem(userId, sellerId, items, amount = 1) {
    try {
      const sellerInventory = await InventoryItem.find({ userId: sellerId, name: items.name });
      if (sellerInventory.length === 0) {
        return false; // Item not found in the seller's inventory
      }

      const item = sellerInventory[0];
      if (item.amount < amount) {
        return false; // Not enough quantity available for purchase
      }

      const buyerInventory = await InventoryItem.findOne({ userId, name: items.name });
      if (buyerInventory) {
        buyerInventory.amount += amount;
        await buyerInventory.save();
      } else {
        const boughtItem = new InventoryItem({
          userId,
          itemId: this.generateItemId(),
          name: items.name,
          amount,
          price: items.price,
        });
        await boughtItem.save();
      }

      item.amount -= amount;
      if (item.amount === 0) {
        await item.remove();
      } else {
        await item.save();
      }

      console.log("Item bought and added to inventory:", item);
      return true;
    } catch (error) {
      console.error("Error buying item:", error);
      return false;
    }
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
  async saveUserWithDefaultItems(userId, defaultItems) {
    try {
      const existingInventory = await InventoryItem.find({ userId });
      if (existingInventory.length === 0) {
        const items = defaultItems.map(item => ({
          userId,
          itemId: this.generateItemId(),
          name: item.name,
          amount: item.amount,
          price: item.price,
        }));
        await InventoryItem.insertMany(items);
        console.log("User saved with default items:", userId);
        return true;
      }
      return false; // User already exists
    } catch (error) {
      console.error("Error saving user with default items:", error);
      return false;
    }
  }
}

module.exports = { InventorySystem };
