const mongoose = require('mongoose');

const backupSchema = mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
  },
  guildInfo: {
    type: Array,
    default: [],
  },
});

const backUpSchema = mongoose.model('backups', backupSchema);
