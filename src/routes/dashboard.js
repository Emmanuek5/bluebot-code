const express = require("express");
const router = express.Router();
const passport = require("passport");
const { checkAuthenticated, checkNotAuthenticated } = require("../functions/authfunctions");

router.get("/", checkAuthenticated, (req, res) => {
  res.render("dash/dashboard.ejs", { user: req.user, message: req.flash("success_msg") });
});

router.get("/:id", checkAuthenticated, (req, res) => {
  res.json(req.user).status(200);
});

function getuserinfo(req) {}

router.get("/profile", checkAuthenticated, (req, res) => {
  res.render("dash/profile", { user: req.user });
});

module.exports = router;
