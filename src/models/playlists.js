const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  playlists: {
    type: Array,
    default: [],
  },
});
