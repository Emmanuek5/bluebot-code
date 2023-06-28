const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  songs: {
    type: Array,
    default: [],
  },
});
