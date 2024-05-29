const { promisify } = require('util');

const redis = require('redis');
const config = require('../config');
// Create Redis client
const redisClient = redis.createClient({
  url: `redis://${config.redis.connection.host}:${config.redis.connection.port}`,
  legacyMode: true,
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const set = (key, object) => {
  const value = JSON.stringify(object);
  return setAsync(key, value);
};
const get = async (key) => {
  const value = await getAsync(key);
  if (!value) return value;
  return JSON.parse(value);
};

module.exports = { redisClient, set, get };
