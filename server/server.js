// Packages

const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Local

const PORT = process.env.PORT || 3000;
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

// POST /todos

app.post('/todos', (req, res) => {
  let todo = new Todo({ text: req.body.text });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    },
  );
});

// GET /todos

app.get('/todos', (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    },
  );
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

// Final

app.get('*', (req, res) => res.send('404 - Not found'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };
