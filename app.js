const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

//import configured passport middleware
const passport = require('./server/config/passport');

//import routes
const UserRoutes = require('./server/routes/users');
const TodoRoutes = require('./server/routes/todos');

//configure cors
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
};

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use passport and cors middlewares
app.use(passport);
app.use(cors(corsOptions));

// Setup a default catch-all route that sends back a message in JSON format.

//use routes defined in ./server/routes
app.use('', UserRoutes);
app.use('', TodoRoutes);

module.exports = app;
