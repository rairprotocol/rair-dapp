const {
  PRODUCTION,
  SENTRY_DSN,
  BASE_RAIRNODE_URL,
  LOG_LEVEL,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

module.exports = {
  production: !!(PRODUCTION && PRODUCTION === 'true'),
  logLevel: LOG_LEVEL || 'info',
  sentry: {
    dsn: SENTRY_DSN || '',
    serverName: 'blockchain-service',
    logLevels: ['error'],
  },
  rairnode: {
    baseUri: BASE_RAIRNODE_URL,
  },
  redis: {
    connection: { host: REDIS_HOST, port: REDIS_PORT },
  },
};
