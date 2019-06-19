const express = require('express');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const db = require('../models');
const passport = require('passport');

const authRoute = passport.authenticate('bearer', { session: false });

const router = express.Router();

function hashPw(pw) {
  return bcrypt.hashSync(pw, 10);
}

router.post('/sign-up', async (req, res) => {
  try {
    user = await db.User.create({
      username: req.body.username,
      password: hashPw(req.body.password)
    });

    res.send(201);
  } catch (err) {
    res.send(err);
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { username: req.body.username } });

    if (!user) {
      return res.status(400).send({ error: 'invalid username' });
    }

    if (!user.validPassword(req.body.password)) {
      return res.status(400).send({ error: 'incorrect password' });
    }
    //reroll token and send to user
    user.token = crypto.randomBytes(16).toString('hex');
    await user.save();
    await user.reload();

    const resObj = user.get({ plain: true });
    delete resObj.password;

    return res.status(200).send(resObj);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/change-pass', authRoute, async (req, res) => {
  try {
    if (!req.user.validPassword(req.body.oldPassword)) {
      return res.status(400).send({ error: 'Incorrect password' });
    }
    if (req.user.validPassword(req.body.newPassword)) {
      return res.status(400).send({ error: 'New password must be different' });
    }

    req.user.password = hashPw(req.body.newPassword);
    await req.user.save();

    res.status(201).send({ message: 'password changed' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/sign-out', authRoute, (req, res) => {
  //reroll token so that user's token is invalidated
  req.user.token = crypto.randomBytes(16).toString('hex');

  //using .then instead of async await because straightforward logic here
  req.user
    .save()
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
