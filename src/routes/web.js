const express = require("express");
require("dotenv").config();
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs", {
    botname: process.env.BOT_NAME,
    servers: process.env.SERVER_COUNT,
    users: process.env.USER_COUNT,
    channels: process.env.CHANNEL_COUNT,
    invite: process.env.INVITE,
  });
});

router.get("/status", (req, res) => {
  res.send("Online").status(200);
});

router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/");
});
const commands = require("../utils/commands.js");

router.get("/docs/commands", (req, res) => {
  commands.getCommands().then(data => {
    res.render("docs/commands.ejs", {
      botname: process.env.BOT_NAME,
      prefix: process.env.PREFIX,
      commands: data,
    });
  });
});
router.get("/docs/tutorials", (req, res) => {
  res.render("docs/tutorials.ejs", { botname: process.env.BOT_NAME, prefix: process.env.PREFIX });
});

module.exports = router;
