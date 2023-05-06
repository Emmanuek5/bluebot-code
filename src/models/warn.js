const mongoose = require('mongoose');

const WarnSchema = new mongoose.Schema({
  GuildId: String,
  UserId: String,
  WarnCount: Number,
  WarnedAt: Date,
  WarnedBy: String,
  WarnReason: String,
});

module.exports = mongoose.model('warns', WarnSchema);
