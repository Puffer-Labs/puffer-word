const bcrypt = require("bcrypt");
const User = require("../schema/user");
const passport = require("passport");
const LocalStraegy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((username, done) => {
  User.findOne({ username: username }, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStraegy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  })
);

module.exports = passport;
