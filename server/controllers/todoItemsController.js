const db = require('../models');

//route for create should be /todos/:id
function create(req, res) {
  return db.TodoItem.create({
    content: req.body.content,
    todoId: req.params.id
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(400).send(err));
}

//route for readAll should be /todos/:id/items
function readAll(req, res) {
  return db.TodoItem.findAll({ where: { todoId: req.params.id } })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(500).send(err));
}

//unlikely to be used in client but exposed for testing purposes
//route is /todos/:id/items/:itemId
function readOne(req, res) {
  return db.TodoItem.findOne({ where: { id: req.params.itemId } })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(500).send(err));
}

//update & destroy uses async await syntax since long promise chains get confusing to read
//route is todos/:id/items/:itemId
async function update(req, res) {
  try {
    const todoItem = await db.TodoItem.findOne({ where: { id: req.params.itemId } });
    if (!todoItem) {
      return res.status(400).send({ message: 'invalid item ID' });
    }
    todoItem.content = req.body.content;
    await todoItem.save();
    await todoItem.reload();
    return res.status(200).send(todoItem);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function destroy(req, res) {
  try {
    const todoItem = await db.TodoItem.findOne({ where: { id: req.params.itemId } });
    if (!todoItem) {
      return res.status(400).send({ message: 'invalid item ID' });
    }
    await todoItem.destroy();
    return res.status(201).send({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  create,
  readAll,
  readOne,
  update,
  destroy
};
