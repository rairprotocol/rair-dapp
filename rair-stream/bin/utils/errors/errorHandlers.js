const log = require('../logger')(module);
const AppError = require('./AppError');

module.exports = {
  axiosError: (err) => {
    if (err.response.data.message === 'jwt expired') {
      return new AppError('Your token has expired! Please log in again.', 401);
    }

    if (err.response.data.message === 'invalid signature') {
      return new AppError('Invalid token. Please log in again!', 401);
    }

    const message = `AxiosError: ${err.response.data.message}`;
    const errorCode = err.response.status;
    log.error(`AxiosError: ${message}`);

    return new AppError(message, errorCode);
  },

  errorVieoFormat: () => new AppError('Invalid video format', 400),
  fileNotProvided: () => new AppError('File not provided. Please provide file', 400),

};
