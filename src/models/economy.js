const mongoose = require("mongoose");

const economySchema = new mongoose.Schema({
  Guild: { type: String, required: true },
  User: { type: String, required: true },
  Bank: { type: Number, default: 0 },
  Wallet: { type: Number, default: 0 },
  lastDaily: { type: Number, default: null },
  lastWeekly: { type: Number, default: null },
  lastMonthly: { type: Number, default: null },
});

module.exports = mongoose.model("Economy", economySchema);
