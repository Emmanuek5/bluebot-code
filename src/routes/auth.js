const express = require("express");
const route = express.Router();
const passport = require("passport");
const { checkAuthenticated } = require("../functions/functions");

route.get("/discord/callback", passport.authenticate("discord"), (req, res) => {
  req.flash("success_msg", "You are now logged in");
  res.redirect("/dashboard");
});

route.get("/discord", passport.authenticate("discord"), (req, res) => {});

route.get("/app/discord", checkAuthenticated, (req, res) => {
  const user = req.user;

  res.send("hello");
});

route.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

module.exports = route;
