const express = require('express');
const router = express.Router();
const functions = require('../functions/authfunctions');
const { rand } = require('../functions/functions');
const passport = require('passport');
const localUsers = require('../models/localuser');
const bcrypt = require('bcrypt');

router.get('/', functions.checkNotAuthenticated, (req, res) => {
  res.render('login/login.ejs');
});

router.post(
  '/',
  functions.checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/signup', functions.checkNotAuthenticated, (req, res) => {
  res.render('login/signup.ejs');
});

router.post('/create', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new localUsers({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    console.log(user);
    localUsers.create(user);
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
