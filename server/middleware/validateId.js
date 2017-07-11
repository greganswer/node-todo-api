const { ObjectID } = require('mongodb');

module.exports.validateId = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send({ message: 'Unable to find resource' });
  }
  next();
};
