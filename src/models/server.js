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
  botName: {
    type: String,
    required: true,
    default: "Blue Bot",
  },
  prefix: {
    type: String,
    required: true,
    default: ">",
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
  leveling: {
    type: Boolean,
    required: false,
    default: true,
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
    enabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      required: false,
      default: "embed",
    },
    text: {
      type: String,
      required: false,
      default: "Welcome to the server!",
    },
    role: {
      type: String,
      required: false,
      default: "",
    },
  },
  leaveMessage: {
    enabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    type: {
      type: String,
      required: false,
      default: "embed",
    },
    text: {
      type: String,
      required: false,
      default: "Goodbye! See you next time!",
    },
  },
});

module.exports = mongoose.model("Server", serverSchema);
