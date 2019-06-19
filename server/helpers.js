const bcrypt = require('bcrypt');
const passport = require('passport');

//declares an auth strategy. exported
const protectedRoute = passport.authenticate('bearer', { session: false });

//helper func to hash passwords
function hashPw(pw) {
  return bcrypt.hashSync(pw, 10);
}

module.exports = {
  protectedRoute,
  hashPw
};
