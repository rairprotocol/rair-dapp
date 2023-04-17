const Joi = require('joi');
const schemas = require('../schemas');
const log = require('../utils/logger')(module);
const AppError = require('../utils/errors/AppError');

module.exports = (schemasArray, destination = 'body') => (req, res, next) => {
  try {
    const finalSchema = schemasArray.reduce((result, item) => ({
      ...result,
      ...schemas[item](),
    }), {});

    const schema = Joi.object(finalSchema);
    const { error } = schema.validate(req[destination]);

    if (!error) {
      return next();
    }

    const { details } = error;
    const message = details.map((e) => e.message).join(',');

    log.error(message);

    return next(new AppError(`${message}`, 400));
  } catch (err) {
    return next(err);
  }
};
