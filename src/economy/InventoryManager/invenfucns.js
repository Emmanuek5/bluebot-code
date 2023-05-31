const fs = require('fs');

// Load inventory data from JSON file
let inventoryData = {};
try {
  const data = fs.readFileSync('./inventory.json');
  inventoryData = JSON.parse(data);
} catch (error) {
  console.log('Error reading inventory file:', error);
}

// Load gambling probabilities from JSON file
let gamblingData = {};
try {
  const data = fs.readFileSync('gambling.json');
  gamblingData = JSON.parse(data);
} catch (error) {
  console.log('Error reading gambling file:', error);
}

// Function to get a user's inventory
function getInventory(userId) {
  return inventoryData[userId] || [];
}

// Function to add an item to a user's inventory
function addItem(userId, item) {
  if (!inventoryData[userId]) {
    inventoryData[userId] = [];
  }

  const itemId = generateItemId(); // Generate a unique item ID
  item.id = itemId;
  inventoryData[userId].push(item);

  saveInventory();
}

// Function to sell an item from a user's inventory
function sellItem(userId, itemId, amount = 1) {
  const userInventory = inventoryData[userId];
  if (!userInventory || userInventory.length === 0) {
    return false; // Inventory is empty or user doesn't exist
  }

  const itemIndex = userInventory.findIndex((item) => item.id === itemId);
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

  saveInventory();
  return true; // Item sold successfully
}

// Function to buy an item and add it to a user's inventory
function buyItem(userId, item) {
  if (!inventoryData[userId]) {
    inventoryData[userId] = [];
  }

  const itemId = generateItemId(); // Generate a unique item ID
  item.id = itemId;
  inventoryData[userId].push(item);

  saveInventory();
}

// Function to save inventory data to JSON file
function saveInventory() {
  fs.writeFile('inventory.json', JSON.stringify(inventoryData), (error) => {
    if (error) {
      console.log('Error saving inventory file:', error);
    }
  });
}

// Function to gamble for an item
function gambleItem(userId) {
  const userInventory = inventoryData[userId];
  if (!userInventory) {
    return false; // User doesn't exist
  }

  const items = Object.keys(gamblingData);
  if (items.length === 0) {
    return false; // No items available for gambling
  }

  const probabilities = items.map((item) => gamblingData[item]);
  const itemIndex = getRandomIndex(probabilities);
  const selectedItem = items[itemIndex];

  const itemId = generateItemId(); // Generate a unique item ID
  const item = { id: itemId, name: selectedItem, amount: 1 };

  addItem(userId, item);
  return item; // Item won from gambling
}

// Function to get a random index based on probabilities
function getRandomIndex(probabilities) {
  const totalProbability = probabilities.reduce((total, probability) => total + probability, 0);
  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue < cumulativeProbability) {
      return i;
    }
  }

  return probabilities.length - 1;
}

// Function to generate a unique item ID
function generateItemId() {
  return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
}

module.exports = {
  getInventory,
  addItem,
  sellItem,
  buyItem,
  gambleItem,
};
