const db = require('../models');

function create(req, res) {
  return db.Todos.create({
    title: req.body.title,
    userId: req.user.id
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(400).send(err));
}
function readAll(req, res) {
  return db.Todos.findAll({
    where: { userId: req.user.id },
    include: [db.TodoItem]
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(500).send(err));
}

function readOne(req, res) {
  return db.Todos.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [db.TodoItem]
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(500).send(err));
}

//route for update/destroy: /todos/:id
//update & destroy uses async await syntax since long promise chains get confusing to read
async function update(req, res) {
  try {
    const todo = await db.Todos.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) {
      return res.status(400).send({ message: 'invalid To-do ID' });
    }
    todo.title = req.body.title;
    await todo.save();
    return res.status(200).send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function destroy(req, res) {
  try {
    const todo = await db.Todos.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) {
      return res.status(400).send({ message: 'invalid To-do ID' });
    }
    await todo.destroy();
    return res.status(201).send({ message: 'To-do deleted' });
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
