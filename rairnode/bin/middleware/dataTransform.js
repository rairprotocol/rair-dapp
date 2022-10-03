const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const log = require('../utils/logger')(module);

module.exports = (fieldNames = []) => async (req, res, next) => {
  let fieldName = '';
  try {
    const updatedFields = _.chain(req.body)
      .pick(fieldNames)
      .mapValues((v, k) => {
        fieldName = k;
        return JSON.parse(v);
      })
      .value();

    _.assign(req.body, updatedFields);

    return next();
  } catch (err) {
    log.error(`Invalide data in ${fieldName} `);

    return next(new AppError(`Invalide data in ${fieldName} `, 400));
  }
};
