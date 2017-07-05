// Packages

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Local

const PORT = process.env.PORT || 3000;
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

// Routes

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

// Final

app.get('*', (req, res) => res.send('404 - Not found'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };
