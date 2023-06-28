const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  GuildId: String,
  inviteid: String,
  authorid: String,
});

module.exports = mongoose.model("invites", inviteSchema);
