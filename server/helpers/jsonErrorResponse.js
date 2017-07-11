const _ = require('lodash');

module.exports.jsonErrorResponse = {
  validation(res, e) {
    let errors = _.mapValues(e.errors, error => {
      return { field: error.path, message: error.message };
    });
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
