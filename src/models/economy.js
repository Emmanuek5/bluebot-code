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
  lastDaily: {
    type: Date,
    default: Date.now(),
  },
  lastWeekly: {
    type: Date,
    default: Date.now(),
  },
  lastMonthly: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Economy", economySChema);
