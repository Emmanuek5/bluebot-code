const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  guildName: {
    type: String,
    required: true,
  },
  guildID: {
    type: String,
    unique: true,
    required: true,
  },
  guildOwner: {
    type: String,
    required: true,
  },
  guildMemberCount: {
    type: Number,
    required: true,
  },
  guildIcon: {
    type: String,
    required: false,
  },
  youtubeChannel: {
    type: String,
    required: false,
  },
  serverColor: {
    type: String,
    default: "Random",
  },
  swearWords: {
    type: Boolean,
    required: false,
  },
  bullyMeChannel: {
    type: String,
    default: "",
  },
  welcomeChannel: {
    type: String,
    required: false,
    default: "",
  },
  goodbyeChannel: {
    type: String,
    required: false,
    default: "",
  },
  levelingChannel: {
    type: String,
    required: false,
    default: "",
  },
  welcomeMessage: {
    type: Boolean,
    required: false,
    default: true,
  },
});

module.exports = mongoose.model("Server", serverSchema);
