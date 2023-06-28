const mongoose = require("mongoose");

const economySChema = new mongoose.Schema({
  Guild: {
    type: String,
    required: true,
  },
  User: {
    type: String,
    required: true,
  },
  Bank: {
    type: Number,
    default: 0,
  },
  Wallet: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Economy", economySChema);
