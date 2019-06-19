const db = require('../models');

function create(req, res) {
  return db.Todos.create({
    title: req.body.title,
    userId: req.user.id
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(400).send(err));
}

//shows only to-dos owned by user
function readAll(req, res) {
  return db.Todos.findAll({
    where: { userId: req.user.id },
    include: [db.TodoItem]
  })
    .then(todos => res.status(200).send(todos))
    .catch(err => res.status(500).send(err));
}

//using findOne instead of findByPk to make sure the user has access to the to-do
//this way if id is found but userId is not correct, todo = undefined
function readOne(req, res) {
  return db.Todos.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [db.TodoItem]
  })
    .then(todos => {
      if (!todos) {
        return res.status(400).send({ message: 'invalid To-do ID' });
      }
      return res.status(200).send(todos);
    })
    .catch(err => res.status(500).send(err));
}

//route for update/destroy: /todos/:id
//update & destroy uses async await syntax since long promise chains get confusing to read
//uses findOne instead of findByPk for same reason as readOne
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
