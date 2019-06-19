const express = require('express');
//create a Router mini-app
const router = express.Router();

// import controller funcs
const user = require('../controllers/userController');
//import protectedRoute helper
const protectedRoute = require('../helpers').protectedRoute;

//declare routes
router.post('/sign-up', user.createUser);
router.post('/sign-in', user.signIn);
router.patch('/change-pass', protectedRoute, user.changePw);
router.delete('/sign-out', protectedRoute, user.signOut);

module.exports = router;
