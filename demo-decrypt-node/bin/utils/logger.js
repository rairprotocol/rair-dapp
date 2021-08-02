const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf, label, errors, colorize } = format;
const _ = require('lodash');

module.exports = (module) => {
  const path = module.filename.split('/').slice(-2).join('/');
  const myFormat = printf(({ level, message, timestamp, errors, ...metadata }) => {
    let msg = `${ timestamp } [${ level }] : ${ message } `;

    if (metadata && !_.isEmpty(metadata)) {
      msg = `${ msg } - ${ JSON.stringify(metadata) }`;
    }

    if (errors && !_.isEmpty(errors)) {
      msg = `${ msg } - stack: ${ errors.stack }`;
    }
    return msg;
  });

  return new createLogger({
    level: 'debug',
    format: combine(
      errors({ stack: true }),
      label({ label: path, message: true }),
      colorize(),
      splat(),
      timestamp(),
      myFormat
    ),
    transports: [new transports.Console()],
  });
}
