const mongoose = require("mongoose");

VoiceSchema = new mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  channelID: {
    type: String,
    required: true,
  },
});

const VoiceModel = (module.exports = mongoose.model("VoiceChannels", VoiceSchema));
