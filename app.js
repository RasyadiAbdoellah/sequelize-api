const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('./server/config/passport');

const AuthRoute = require('./server/routes/auth');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.use('/auth', AuthRoute);
app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Oops nothing here'
  })
);

module.exports = app;
