const redis = require('redis');
const config = require('../config');
const log = require('../utils/logger')(module);
// Create Redis client
const redisPublisher = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
});
const redisClient = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
});

redisPublisher.connect().catch(log.error);
redisClient.connect().catch(log.error);

module.exports = { redisPublisher, redisClient };
