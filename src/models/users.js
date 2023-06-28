const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  guilds: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);
