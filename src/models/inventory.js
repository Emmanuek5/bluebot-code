const mongoose = require("mongoose");

// Define the inventory item schema
const InventoryItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create the Mongoose model for inventory items
const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);
