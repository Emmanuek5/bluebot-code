const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tokens", tokenSchema);
