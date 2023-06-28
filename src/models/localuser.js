const mongoose = require("mongoose");

const localUsers = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  userid: { type: String, required: true },
  discordId: { type: String, required: false, default: null },
});

module.exports = mongoose.model("LocalUser", localUsers);
