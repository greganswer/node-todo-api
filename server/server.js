require('./config/config');

// Modules

const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
app.use(bodyParser.json());

// Local

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const { mongoose } = require('./db/mongoose');
const { authenticate } = require('./middleware/authenticate');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

// POST /todos

app.post('/todos', (req, res) => {
  let todo = new Todo({ text: req.body.text });

  todo
    .save()
    .then(todo => res.send(todo))
    .catch(e => res.status(400).send('Something went wrong'));
});

// GET /todos

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(e => res.status(400).send('Something went wrong'));
});

// GET /todos/:id

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send('Something went wrong'));
});

// DELETE /todos/:id

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send('Something went wrong'));
});

// PATCH /todos/:id

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send('Something went wrong'));
});

// POST /users

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send({ user }))
    .catch(e => res.status(400).send('Something went wrong'));
});

// GET /users/me

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// Final

let message = `Server is running on port ${PORT} in ${ENV}`;
app.get('*', (req, res) => res.send('404 - Not found'));
app.listen(PORT, () => console.log(message));

module.exports = { app };
