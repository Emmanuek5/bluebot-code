const mongoose = require("mongoose");

const ReactionRoleSchema = new mongoose.Schema({
  GuildId: String,
  roles: Array,
});

module.exports = mongoose.model("reaction-roles", ReactionRoleSchema);
