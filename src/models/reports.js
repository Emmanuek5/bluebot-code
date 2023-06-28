const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  reasons: {
    type: Array,
    required: true,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  guildId: {
    type: String,
  },
});

module.exports = mongoose.model("reports", reportSchema);
