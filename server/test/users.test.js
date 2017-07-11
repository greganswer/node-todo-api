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

/**
 * POST /users/login
 */
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
      .expect(400)
      .expect(res => expect(res.headers['x-auth']).toNotExist({}))
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
