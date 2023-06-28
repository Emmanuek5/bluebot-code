const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/localuser");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
      User.findOne({
        email: email,
      }).then(currentUser => {
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

// serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
