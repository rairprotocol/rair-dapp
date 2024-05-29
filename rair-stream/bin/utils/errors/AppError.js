class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOpetational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
