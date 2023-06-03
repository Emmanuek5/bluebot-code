const fs = require("fs");
const path = require("path")
class InventorySystem {
  constructor() {
    this.inventoryData = {};
    this.gamblingData = {};

    // Load inventory data from JSON file
    try {
      const data = fs.readFileSync(path.join(__dirname, "./inventory.json"));
      this.inventoryData = JSON.parse(data);
    } catch (error) {
      console.log("Error reading inventory file:", error);
    }

    // Load gambling probabilities from JSON file
    try {
      const data = fs.readFileSync(path.join(__dirname, "./gambling.json"));
      this.gamblingData = JSON.parse(data);
    } catch (error) {
      console.log("Error reading gambling file:", error);
    }
  }

  // Function to get a user's inventory
  getInventory(userId) {
    console.log("Getting inventory for user:", userId);
    return this.inventoryData[userId] || [];
  }

  // Function to add an item to a user's inventory
  addItem(userId, item) {
    if (!this.inventoryData[userId]) {
      this.inventoryData[userId] = [];
    }

    const itemId = this.generateItemId(); // Generate a unique item ID
    item.id = itemId;
    this.inventoryData[userId].push(item);

    this.saveInventory();
  }

  // Function to sell an item from a user's inventory
  sellItem(userId, itemId, amount = 1) {
    const userInventory = this.inventoryData[userId];
    if (!userInventory || userInventory.length === 0) {
      return false; // Inventory is empty or user doesn't exist
    }

    const itemIndex = userInventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return false; // Item not found in the inventory
    }

    const item = userInventory[itemIndex];
    if (item.amount < amount) {
      return false; // Not enough quantity to sell
    }

    item.amount -= amount;
    if (item.amount === 0) {
      userInventory.splice(itemIndex, 1);
    }

    this.saveInventory();
    return true; // Item sold successfully
  }

  // Function to buy an item and add it to a user's inventory
  buyItem(userId, sellerId, items, amount = 1) {
    const sellerInventory = this.inventoryData[sellerId];
    if (!sellerInventory || sellerInventory.length === 0) {
      return false; // Seller's inventory is empty or seller doesn't exist
    }

    const itemIndex = sellerInventory.findIndex(item => items.name === item);
    if (itemIndex === -1) {
      return false; // Item not found in the seller's inventory
    }

    const item = sellerInventory[itemIndex];
    if (item.amount < amount) {
      return false; // Not enough quantity available for purchase
    }


    const buyerInventory = this.inventoryData[userId];
    if (!buyerInventory) {
      this.inventoryData[userId] = [];
    }

    // Check if the item ID already exists in the buyer's inventory
    const existingItem = buyerInventory.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.amount += amount;
    } else {
      const boughtItem = { id: item.id, name: item.name, amount, price: pamount };
      buyerInventory.push(boughtItem);
    }


      
    
    item.amount -= amount;
    if (item.amount === 0) {
      sellerInventory.splice(itemIndex, 1);
    }

    this.saveInventory();
    return true; // Item bought successfully
  }

  // Function to gamble for an item
  gambleItem(userId,uitem) {
    const userInventory = this.inventoryData[userId];
    if (!userInventory) {
      return false; // User doesn't exist
    }

    const items = Object.keys(this.gamblingData);
    if (items.length === 0) {
      return false; // No items available for gambling
    }

    const probabilities = items.map(item => this.gamblingData[item]);
    const itemIndex = this.getRandomIndex(probabilities);
    const selectedItem = items[itemIndex];

    const itemId = this.generateItemId(); // Generate a unique item ID
    const item = { id: itemId, name: selectedItem, amount: 1 , price: 1000 };

    if (item == uitem) return false;

    this.addItem(userId, item);
    return item; // Item won from gambling
  }

  // Function to save inventory data to JSON file
  async saveInventory() {
    console.log("Saving inventory...");
    const fs = require("fs");
    const path = require("path");

    // Save inventory data to JSON file
    
    fs.writeFile(
      path.join(__dirname, "./inventory.json"),
      JSON.stringify(this.inventoryData),
      this.savetoPasteBin()
      ,
      error => {
        if (error) {
          console.log("Error saving inventory file:", error);
        }
      }
    );
    
  }

  // Function to generate a unique item ID
  generateItemId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
  }

  savetoPasteBin() {
    console.log("Saving inventory to PasteBin...");
    const path = require("path");
    const fs = require("fs");
    const fetch = require("node-fetch");

    // Read the inventory data from the JSON file
    const inventoryData = fs.readFileSync(path.join(__dirname, "./inventory.json"));

    // Convert the inventory data to a string
    const inventoryString = inventoryData.toString();

    // Define the PasteBin API endpoint
    const pasteBinEndpoint = "https://pastebin.com/api/api_post.php";

    // Define the required parameters for creating a PasteBin paste
    const pasteBinParameters = {
      api_dev_key: "tl8rVRHyfiaSaDGCXCpOssfq-oG64bTu",
      api_option: "paste",
      api_paste_code: inventoryString,
      api_paste_private: 1, // Set the paste as public (0) or private (1)
      api_user_key: "6ef577032373f3c97d3545d4c116621f",
      api_paste_name: `Inevntory ${new Date().toISOString()}`,
    };

    // Send a POST request to the PasteBin API
    fetch(pasteBinEndpoint, {
      method: "POST",
      body: new URLSearchParams(pasteBinParameters),
    })
      .then(response => response.text())
      .then(result => {
        console.log("Inventory saved to PasteBin:", result);
      })
      .catch(error => {
        console.error("Error saving inventory to PasteBin:", error);
      });
  }
  // Function to save a user with default items
  saveUserWithDefaultItems(userId, defaultItems) {
    console.log("Saving user:", userId);
    if (!this.inventoryData[userId]) {
      this.inventoryData[userId] = defaultItems;
      console.log(defaultItems, this.inventoryData);
      this.saveInventory();
      this.savetoPasteBin();
      return true; // User saved with default items successfully
    }

    return false; // User already exists
  }



   getItemInfo(userId, itemName) {
  const userInventory = this.inventoryData[userId];
  if (!userInventory) {
    return false; // User doesn't exist
  }

  const itemIndex = Object.values(userInventory).findIndex(item => item.name === itemName);
  if (itemIndex === -1) {
    return false; // Item not found in the inventory
  }

  return userInventory[itemIndex];
}

  

}



module.exports = {InventorySystem};
