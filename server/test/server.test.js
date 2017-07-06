// Packages

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', done => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app).post('/todos').send({}).expect(400).end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find()
        .then(todos => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch(e => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get a todo', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => expect(res.body.todo.text).toBe(todos[0].text))
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object IDs', done => {
    request(app).get('/todos/123').expect(404).end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo', done => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => expect(res.body.todo._id).toBe(hexId))
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object IDs', done => {
    request(app).delete('/todos/123').expect(404).end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', done => {
    let hexId = todos[0]._id.toHexString();
    let text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: true, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
          .then(todo => {
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should clear completedAt when todo is not completed', done => {
    let hexId = todos[1]._id.toHexString();
    let text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({ completed: false, text })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId)
          .then(todo => {
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object IDs', done => {
    request(app).patch('/todos/123').expect(404).end(done);
  });
});

describe('GET /users/me', () => {
  it('should return a user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => expect(res.body).toEqual({}))
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    let data = { email: 'example@example.com', password: 'abc789$' };

    request(app)
      .post('/users')
      .send(data)
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.user._id).toExist();
        expect(res.body.user.email).toBe(data.email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({ email: data.email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(data.password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation errors if request is invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'and', password: '12345' })
      .expect(400)
      .expect(res => expect(res.body).toEqual({}))
      .end(done);
  });

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'faldjskf' })
      .expect(400)
      .expect(res => expect(res.body).toEqual({}))
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login users and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(res => expect(res.headers['x-auth']).toExist({}))
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth'],
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid credentials', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: 'fadsfja;j' })
      .expect(400)
      .expect(res => expect(res.headers['x-auth']).toNotExist({}))
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
