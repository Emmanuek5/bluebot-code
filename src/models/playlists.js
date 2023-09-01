const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  guildID: String,
  name: String,
  songs: Array,
});

module.exports = mongoose.model("playlist", playlistSchema);