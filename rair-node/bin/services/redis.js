const redis = require('redis');
const config = require('../config');
const log = require('../utils/logger')(module);
// Create Redis client
const redisPublisher = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
  pingInterval: 1000,
});
const redisSubscriber = redisPublisher.duplicate();
const redisClient = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
  pingInterval: 1000,
  legacyMode: true,
});

redisPublisher.connect().catch(log.error);
redisSubscriber.connect().catch(log.error);
redisClient.connect().catch(log.error);

redisPublisher.on('error', (error) => {
  log.error('Redis publisher error:', error);
});
redisSubscriber.on('error', (error) => {
  log.error('Redis subscriber error:', error);
});
redisClient.on('error', (error) => {
  log.error('Redis client error:', error);
});

module.exports = { redisPublisher, redisSubscriber, redisClient };
