// eslint-disable-next-line max-classes-per-file
const Sentry = require('@sentry/node');
const Transport = require('winston-transport');
const { LEVEL } = require('triple-beam');
const _ = require('lodash');
const config = require('../../config');

const { dsn, serverName, logLevels } = config.sentry;

class ExtendedError extends Error {
  constructor(info) {
    super(info.message);

    this.name = info.name || 'Error';
    this.stack = _.get(info, 'metadata.stack', info.stack || this.stack);
  }
}

module.exports = class SentryTransport extends Transport {
  constructor(opts) {
    super(opts);

    Sentry.init({
      dsn,
      serverName,
      environment: 'production',
      debug: false,
      sampleRate: 1.0,
      maxBreadcrumbs: 100,
    });
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const { message, tags, user, ...meta } = info;
    const winstonLevel = info[LEVEL];

    Sentry.configureScope((scope) => {
      scope.clear();

      if (tags !== undefined && SentryTransport.isObject(tags)) {
        scope.setTags(tags);
      }

      scope.setExtras(meta);

      if (user !== undefined && SentryTransport.isObject(user)) {
        scope.setUser(user);
      }
    });

    // Capturing Messages
    if (_.includes(logLevels, winstonLevel)) {
      if (winstonLevel === 'error') {
        const error = message instanceof Error ? message : new ExtendedError(info);
        Sentry.captureException(error, { tags });

        return callback();
      }

      Sentry.captureMessage(message);
    }

    return callback();
  }

  end(...args) {
    Sentry.flush().then(() => {
      super.end(...args);
    });
    return this;
  }

  static isObject(obj) {
    const type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }
};
