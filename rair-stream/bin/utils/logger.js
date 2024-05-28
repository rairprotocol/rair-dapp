const { createLogger, format, transports } = require('winston');
const _ = require('lodash');

const SentryTransport = require('./loggerTransports/sentryTransport');
const config = require('../config');

const { combine, splat, timestamp, printf, label, errors, colorize, metadata } = format;

module.exports = (module) => {
  const path = module.filename.split('/').slice(-2).join('/');
  const myFormat = printf(({ level, message, timestamp, stack }) => {
    let msg = `${timestamp} [${level}] : ${message} `;

    if (stack && !_.isEmpty(stack)) {
      msg = `${msg} - ${stack}`;
    }
    return msg;
  });

  // eslint-disable-next-line new-cap
  const logger = new createLogger({
    level: config.logLevel,
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

  if (config.production) {
    logger.add(new SentryTransport());
  }

  return logger;
};
