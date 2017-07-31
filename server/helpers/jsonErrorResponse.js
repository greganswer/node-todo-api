const _ = require('lodash');

module.exports.jsonErrorResponse = {
  validation(res, e) {
    const errors = _.mapValues(e.errors, error => ({ field: error.path, message: error.message }));
    return res.status(422).send({
      message: e.message,
      errors: _.values(errors),
    });
  },

  notFound(res, item) {
    return res.status(404).send({
      message: `Unable to find ${item}`,
    });
  },
};
