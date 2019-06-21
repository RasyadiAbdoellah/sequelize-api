const passport = require('passport');
const bearer = require('passport-http-bearer');
const isBefore = require('date-fns/is_before');
const addHours = require('date-fns/add_hours');
const db = require('../models');

const strategy = new bearer.Strategy((token, done) => {
  // look for a user whose token matches the one from the header
  db.User.findOne({ where: { token: token } })
    .then(async user => {
      if (!isBefore(Date.now(), user.tokenExpiresAt)) {
        throw new Error('Token has expired');
      }
      console.log(user);
      //renew expiration with every request to a protected route. token expires after 2 hours of inactivity
      user.tokenExpiresAt = addHours(Date.now(), 2);
      await user.save();
      await user.reload();
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
