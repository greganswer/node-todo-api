/**
 * Modules
 */
const mongoose = require('mongoose');
const _ = require('lodash');

const TodoSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: [true, 'text must be present'],
    minlength: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

/*
  The JSON representation of the Todo object
 */
TodoSchema.methods.toJSON = function toJSON() {
  const todo = this;
  const todoObject = todo.toObject();

  return _.pick(todoObject, ['_id', '_userId', 'text', 'completed', 'completedAt']);
};

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = { Todo };
