const { isAxiosError } = require('axios');
const log = require('../logger')(module);
const { cleanStorage } = require('../helpers');
const {
  axiosError,
  errorVieoFormat,
  fileNotProvided
} = require('./errorHandlers');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/ms/api')) {
    res
      .status(err.statusCode)
      .json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
      });
  } else {
    res
      .status(err.statusCode)
      .json({
        title: 'Spmething went wrong',
        msg: err.message,
      });
  }
};

const sendErrorProd = (err, res) => {
  if (res.req.originalUrl.startsWith('/ms/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational || isAxiosError) {
      return res
        .status(err.statusCode || err.response.status)
        .json({
          status: err.status,
          message: err.message,
        });
    }
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    log.error('ERROR', err);

    // 2) Send generic message
    return res.status(500).json({
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

  log.error(err);

  // eslint-disable-next-line no-param-reassign
  err.statusCode = err.statusCode || 500;
  // eslint-disable-next-line no-param-reassign
  err.status = err.status || 'error';

  if (process.env.PRODUCTION === 'false') {
    let error = Object.assign(err);
    if (isAxiosError(error) && error.response) error = axiosError(error);
    if (error.message === '"type" is required') error = errorVieoFormat();
    if (error.message === '"video" is not allowed') error = fileNotProvided();
    sendErrorDev(error, req, res);
  }

  if (process.env.PRODUCTION === 'true') {
    let error = Object.assign(err);
    if (isAxiosError(error) && error.response) error = axiosError(error);
    if (error.message === '"type" is required') error = errorVieoFormat();
    if (error.message === '"video" is not allowed') error = fileNotProvided();
    sendErrorProd(error, res);
  }
  return next();
};
