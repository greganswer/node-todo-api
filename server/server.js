require('./config/config');

/**
 * Modules
 */
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();

app.use(bodyParser.json());

/**
 * Local
 */
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const { authenticate } = require('./middleware/authenticate');
const { validateId } = require('./middleware/validateId');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

/**
 * POST /todos
 */
app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    _userId: req.user._id,
    text: req.body.text,
  });
  todo.save().then(todo => res.send({ todo })).catch((e) => {
    const errors = _.mapValues(e.errors, error => ({ field: error.path, message: error.message }));

    return res.status(422).send({
      message: e.message,
      errors: _.values(errors),
    });
  });
});

/**
 * GET /todos
 */
app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _userId: req.user._id })
    .then(todos => res.send({ todos }))
    .catch(e => res.status(400).send());
});

/**
 * GET /todos/:id
 */
app.get('/todos/:id', authenticate, validateId, (req, res) => {
  Todo.findOne({ _id: req.params.id })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send({ message: 'Unable to find resource' });
      } else if (!todo._userId.equals(req.user._id)) {
        return res.status(403).send({ message: "Sorry, you don't have access to this" });
      }

      res.send({ todo });
    })
    .catch(e => res.status(404).send({ message: 'Unable to find resource' }));
});

/**
 * DELETE /todos/:id
 */
app.delete('/todos/:id', authenticate, validateId, async (req, res) => {
  try {
    const todo = await Todo.findOneAndRemove({
      _id: req.params.id,
      _userId: req.user._id,
    });

    if (!todo) {
      return res.status(404).send({ message: 'Unable to find resource' });
    }

    res.send({ todo });
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * PATCH /todos/:id
 */
app.patch('/todos/:id', authenticate, validateId, (req, res) => {
  const body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: req.params.id }, { $set: body }, { new: true })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send({ message: 'Unable to find resource' });
      } else if (!todo._userId.equals(req.user._id)) {
        return res.status(403).send({ message: "Sorry, you don't have access to this" });
      }

      res.send({ todo });
    })
    .catch(e => res.status(400).send({ message: 'Unable to find resource' }));
});

/**
 * POST /users
 */
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({ user });
  } catch (e) {
    const errors = _.mapValues(e.errors, error => ({ field: error.path, message: error.message }));
    res.status(422).send({ message: e.message, errors: _.values(errors) });
  }
});

/**
 * GET /users/me
 */
app.get('/users/me', authenticate, (req, res) => {
  res.send({ user: req.user });
});

/**
 * POST /users/login
 */
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send({ user });
  } catch (e) {
    res.status(401).send({ message: 'Invalid email or password', errors: [] });
  }
});

/**
 * POST /users/me/token
 */
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * Final
 */
const message = `Server is running on port ${PORT} in ${ENV}`;
app.get('*', (req, res) => res.send('404 - Not found'));
app.listen(PORT, () => console.log(message));
module.exports = { app };
