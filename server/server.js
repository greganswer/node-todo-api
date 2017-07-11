require('./config/config');

/*
 * Modules
 */
const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const bcrypt = require('bcryptjs');
app.use(bodyParser.json());

/*
 * Local
 */
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const { mongoose } = require('./db/mongoose');
const { authenticate } = require('./middleware/authenticate');
const { validateId } = require('./middleware/validateId');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

/*
 * POST /todos
 */
app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    _userId: req.user._id,
    text: req.body.text,
  });

  todo.save().then(todo => res.send(todo)).catch(e => res.status(400).send());
});

/*
 * GET /todos
 */
app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _userId: req.user._id })
    .then(todos => res.send({ todos }))
    .catch(e => res.status(400).send());
});

/*
 * GET /todos/:id
 */
app.get('/todos/:id', authenticate, validateId, (req, res) => {
  Todo.findOne({ _id: req.params.id, _userId: req.user._id })
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

/*
 * DELETE /todos/:id
 */
app.delete('/todos/:id', authenticate, validateId, (req, res) => {
  Todo.findOneAndRemove({ _id: req.params.id, _userId: req.user._id })
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

/*
 * PATCH /todos/:id
 */
app.patch('/todos/:id', authenticate, validateId, (req, res) => {
  let body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    { _id: req.params.id, _userId: req.user._id },
    { $set: body },
    { new: true },
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not found');
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

/*
 * POST /users
 */
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user
    .save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send({ user }))
    .catch(e => res.status(400).send());
});

/*
 * GET /users/me
 */
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

/*
 * POST /users/login
 */
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send({ user });
      });
    })
    .catch(e => res.status(400).send());
});

/*
 * POST /users/me/token
 */
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    },
  );
});

/*
 * Final
 */
let message = `Server is running on port ${PORT} in ${ENV}`;
app.get('*', (req, res) => res.send('404 - Not found'));
app.listen(PORT, () => console.log(message));
module.exports = { app };
