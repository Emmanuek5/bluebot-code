const Spotify = require("node-spotify-api");
require("dotenv").config();
// Replace <client_id> and <client_secret> with your Spotify API client ID and secret, respectively
const spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
});

// Search for a song

function search(track) {
  spotify.search({ type: "track", query: track }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      return data;
    }
  });
}

// Get a song stream

function getStream(track) {
  spotify.search({ type: "track", query: track }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      return data.tracks.items[0].preview_url;
    }
  });
}
module.exports = { search, getStream };
