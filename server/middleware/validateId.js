const { ObjectID } = require('mongodb');

module.exports.validateId = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('Invalid ID');
  }
  next();
};
