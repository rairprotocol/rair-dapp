const { createLogger, format, transports } = require('winston');

const {
  combine, splat, timestamp, printf, label, errors, colorize, metadata,
} = format;
const _ = require('lodash');

const { LOG_LEVEL } = process.env;

module.exports = (module) => {
  const path = module.filename.split('/').slice(-2).join('/');
  const myFormat = printf(({
    level, message, timestamp, stack,
  }) => {
    let msg = `${timestamp} [${level}] : ${message} `;

    if (stack && !_.isEmpty(stack)) {
      msg = `${msg} - ${stack}`;
    }
    return msg;
  });

  return new createLogger({
    level: LOG_LEVEL || 'info',
    format: combine(
      errors({ stack: true }),
      label({ label: path, message: true }),
      colorize(),
      splat(),
      timestamp(),
      myFormat,
      metadata(),
    ),
    transports: [
      new transports.Console(),
    ],
  });
};
