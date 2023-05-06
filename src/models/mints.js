const mongoose = require('mongoose');

const mintSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  uses: {
    type: Number,
    required: true,
  },
  maxUses: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 86400,
  },
});

module.exports = mongoose.model('mints', mintSchema);
