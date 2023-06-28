// create a new DiscordStrategy instance
const DiscordStrategy = require("passport-discord").Strategy;
// import the User model
const User = require("../models/users");
const LocalStrategy = require("passport-local").Strategy;
const localUser = require("../models/localuser");
// import the passport module
const passport = require("passport");
const bcrypt = require("bcrypt");
// import the config module

// create a new DiscordStrategy instance
passport.use(
  "discord",
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["identify", "email", "guilds", "guild.join"],
    },
    (accessToken, refreshToken, profile, done) => {
      // find the user in the database based on their discord
      User.findOne({
        discordId: profile.id,
      }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          // if not, create a new user
          new User({
            discordId: profile.id,
            username: profile.username,
            email: profile.email,
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  "local",
  new LocalStrategy(
    {
      //check if the user is in the database and if the password is correct
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      // find the user in the database based on their email
      localUser
        .findOne({
          email: email,
        })
        .then(currentUser => {
          if (currentUser) {
            // if we already have a record with the given profile ID
            bcrypt.compare(password, currentUser.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, currentUser);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          } else {
            return done(null, false, { message: "That email is not registered" });
          }
        });
    }
  )
);

// serialize the user for both discord and local
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// deserialize in a way that works for both discord and local
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err);
    if (user) {
      done(null, user);
    } else {
      localUser.findById(id, (err, user) => {
        done(err, user);
      });
    }
  });
});

module.exports = passport;
