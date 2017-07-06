// Packages

const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Code

// Todo.remove({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndRemove({props})
// Todo.findByIdAndRemove(id)
