const redis = require('redis');
const config = require('../config');
const log = require('../utils/logger')(module);
// Create Redis client
const redisPublisher = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
});
const redisSubscriber = redisPublisher.duplicate();
const redisClient = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
  legacyMode: true,
});

redisPublisher.connect().catch(log.error);
redisSubscriber.connect().catch(log.error);
redisClient.connect().catch(log.error);

module.exports = { redisPublisher, redisSubscriber, redisClient };
