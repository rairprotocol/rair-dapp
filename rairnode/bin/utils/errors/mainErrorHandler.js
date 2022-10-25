const { cleanStorage } = require('../helpers');
const log = require('../logger')(module);
const {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleJWTError,
  handleJWTExpiredError,
  handleValidationErrorDB,
} = require('./errorHandlers');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    log.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = async (err, req, res, next) => {
  // remove temporary files if validation of some middleware was rejected
  try {
    await cleanStorage(req.files || req.file);
  } catch (e) {
    log.error(e);
  }
  // prevents from server drop by headers already sent
  if (res.headersSent) {
    return next(err);
  }
  log.error(err);
  // eslint-disable-next-line no-param-reassign
  err.statusCode = err.statusCode || 500;
  // eslint-disable-next-line no-param-reassign
  err.status = err.status || 'error';
  let error = Object.assign(err);
  if (process.env.PRODUCTION !== 'true') {
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  }

  if (process.env.PRODUCTION === 'true') {
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  }
  return process.env.PRODUCTION === 'true'
    ? sendErrorProd(error, res)
    : sendErrorDev(error, req, res);
};
