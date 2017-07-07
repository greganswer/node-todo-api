const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'abc123!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    password = hash;
    console.log(password);
  });
});

// let hashedPassword =
//   '$2a$10$Jca2s4.b1HbVeKUvW612dO/zHNwYu5dsg8XzoQAu9MLyEAnbAomPG';
//
// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res);
// });

// let data = {
//   id: 10,
// };
//
// let token = jwt.sign(data, process.env.JWT_SECRET);
// console.log(token);
//
// let decoded = jwt.verify(token, process.env.JWT_SECRET);
// console.log(decoded);

// let message = 'I am user';
// let hash = SHA256(message).toString();
// console.log(message, hash);
//
// let data = {
//   id: 4,
// };
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secret salt').toString(),
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secret salt').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('DATA WAS CHANGED. DO NOT TRUST!');
// }
