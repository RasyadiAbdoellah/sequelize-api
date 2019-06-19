const crypto = require('crypto');

const db = require('../models');

//import hashPw helper
const hashPw = require('../helpers').hashPw;

//createUser will throw an error if the username is not unique
function createUser(req, res) {
  return (
    db.User.create({
      username: req.body.username,
      password: hashPw(req.body.password)
    })
      .then(user => res.send(201))
      //sends the first error message spit out by sequelize
      .catch(err => res.status(400).send(err.errors[0].message))
  );
}

//signIn rolls a new token to be sent to the client. Sessions implementation is up to the client side as of now
//uses async await syntax for better readability
async function signIn(req, res) {
  try {
    const user = await db.User.findOne({ where: { username: req.body.username } });

    if (!user) {
      return res.status(400).send({ error: 'invalid username' });
    }

    if (!user.validPassword(req.body.password)) {
      return res.status(400).send({ error: 'incorrect password' });
    }
    //make new token for user
    user.token = crypto.randomBytes(16).toString('hex');
    await user.save();
    await user.reload();

    const resObj = await user.get('userObj', { plain: true });

    return res.status(200).send(resObj);
  } catch (err) {
    return res.status(500).send(err);
  }
}

function changePw(req, res) {
  //COMMENTING OUT VALIDATING OLD PASSWORD BECAUSE USER IS ALREADY SIGNED-IN

  // if (!req.user.validPassword(req.body.oldPassword)) {
  //   return res.status(400).send({ error: 'Current password is incorrect' });
  // }

  if (req.user.validPassword(req.body.newPassword)) {
    return res.status(400).send({ error: 'New password must be different' });
  }

  req.user.password = hashPw(req.body.newPassword);
  return req.user
    .save()
    .then(() => res.status(201).send({ message: 'password changed' }))
    .catch(err => res.status(500).send(err));
}

function signOut(req, res) {
  //reroll token so that client-side token is invalidated
  req.user.token = crypto.randomBytes(16).toString('hex');
  return req.user
    .save()
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err));
}

module.exports = {
  createUser,
  signIn,
  signOut,
  changePw
};
