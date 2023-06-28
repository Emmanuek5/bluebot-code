const mongoose = require("mongoose");

const rateSchema = mongoose.Schema({
  guildId: {
    type: String,
  },
  userId: {
    type: String,
  },
  lastmsg: {
    type: String,
  },
  msgs: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("rates", rateSchema);
