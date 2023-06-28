const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  usage: {
    type: String,
    default: "None",
  },
  permissions: {
    type: String,
    default: "None",
  },
});

module.exports = mongoose.model("commands", commandSchema);
