const passport = require('passport');
const bearer = require('passport-http-bearer');
const db = require('../models');

const strategy = new bearer.Strategy((token, done) => {
  // look for a user whose token matches the one from the header
  db.User.findOne({ where: { token: token } })
    .then(user => {
      return done(null, user, { scope: 'all' });
    })
    .catch(err => {
      return done(err);
    });
});

passport.use(strategy);

// serialize and deserialize functions are used by passport under
// the hood to determine what `req.user` should be inside routes
passport.serializeUser((user, done) => {
  // we want access to the full object that we got in the
  // strategy callback, so we just pass it along with no modifications
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport.initialize();
