const express = require('express');
//create a Router mini-app
const router = express.Router();
// import controller funcs
const todos = require('../controllers/todosController');
const todoItems = require('../controllers/todoItemsController');
//import protectedRoute helper
const protectedRoute = require('../helpers').protectedRoute;

router.get('/todos', protectedRoute, todos.readAll);
router.post('/todos', protectedRoute, todos.create);
router.patch('/todos/:id', protectedRoute, todos.update);
router.delete('/todos/:id', protectedRoute, todos.destroy);
router.get('/todos/:id/items', protectedRoute, todoItems.readAll);

module.exports = router;
