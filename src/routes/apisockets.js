const express = require('express');
const router = express.Router();
const testtoken = 'atesttoken';
const tokenSchema = require('../models/tokens');
require('dotenv').config();
const { rand, checkAuthenticated } = require('../functions/functions');
const mints = require('../models/mints');
const fs = require('fs');
const path = require('path');

router.get('/bot/version', (req, res) => {
  const filepath = path.join(__dirname, '../data/changelog.txt');
  const changelogs = fs.readFileSync(filepath).toString('utf-8').split('\n');

  const version = {
    version: process.env.VERSION,
    changelog: changelogs,
  };
  res.json(version);
});

module.exports = router;
