const log = require('../logger')(module);
const AppError = require('./AppError');

module.exports = {
  handleCastErrorDB: (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
  },

  handleDuplicateFieldsDB: (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    log.error(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
  },

  handleValidationErrorDB: (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  },

  handleJWTError: () =>
    new AppError('Invalid token. Please log in again!', 401),

  handleJWTExpiredError: () =>
    new AppError('Your token has expired! Please log in again.', 401),
};
