/**
 * Modules
 */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

/**
 * GET /users/me
 */
describe('GET /users/me', () => {
  it('should return a user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res =>
        expect(res.body).toEqual({
          message: 'Not authorized',
          errors: [],
        }),
      )
      .end(done);
  });
});

/**
 * POST /users
 */
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
      .expect(422)
      .expect(res => {
        expect(res.body.message).toEqual('User validation failed');
        expect(res.body.errors).toInclude({
          field: 'email',
          message: '"and" is not a valid email',
        });
        expect(res.body.errors).toInclude({
          field: 'password',
          message: 'Password "12345" must be at least 6 characters',
        });
      })
      .end(done);
  });

  it('should not create user if email is taken', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password: 'faldjskf' })
      .expect(422)
      // TODO: Get this to work
      // .expect(res => {
      //   expect(res.body.message).toEqual('User validation failed');
      //   expect(res.body.errors).toInclude({
      //     field: 'email',
      //     message: `"${users[0].email}" has already been taken`,
      //   });
      // })
      .end(done);
  });
});

/**
 * POST /users/login
 */
describe('POST /users/login', () => {
  it('should login users and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist({});
        expect(res.body.user._id).toExist();
        expect(res.body.user.email).toBe(users[1].email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth'],
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: 'fadsfja;j' })
      .expect(401)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist({});
        expect(res.body.message).toEqual('Invalid email or password');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

/**
 * DELETE /users/me/token
 */
describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
