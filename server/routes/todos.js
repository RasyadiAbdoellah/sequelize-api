const express = require('express');
//create a Router mini-app
const router = express.Router();

// import controller funcs
const todos = require('../controllers/todosController');
const todoItems = require('../controllers/todoItemsController');

//import protectedRoute helper
const protectedRoute = require('../helpers').protectedRoute;

//make all routes protected
router.use(protectedRoute);

//declare routes
router.get('/todos', todos.readAll);
router.get('/todos/:id', todos.readOne);
router.post('/todos', todos.create);
router.patch('/todos/:id', todos.update);
router.delete('/todos/:id', todos.destroy);

//todoItem routes are placed here since some todoItem controllers requires param.id
//may be better to have it on seperate route and have todo id be sent in req.body
router.get('/todos/:id/items', todoItems.readAll);
router.post('/todos/:id/items', todoItems.create);
router.patch('/todos/:id/items/:itemId', todoItems.update);
router.delete('/todos/:id/items/:itemId', todoItems.destroy);

module.exports = router;
