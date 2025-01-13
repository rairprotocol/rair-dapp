const { redisClient } = require('../services/redis');
const { getToken, setToken } = require('../utils/zoomToken');

/**
  * Middleware that checks if a valid (not expired) token exists in redis
  * If invalid or expired, generate a new token, set in redis, and append to http request
  */
const zoomTokenCheck = async (req, res, next) => {
  const redis_token = await redisClient.get('access_token');

  let token = redis_token;

  /**
    * Redis returns:
    * -2 if the key does not exist
    * -1 if the key exists but has no associated expire
    */
  if (!redis_token || ['-1', '-2'].includes(redis_token)) {
    const { access_token, expires_in, error } = await getToken();

    if (error) {
      const { response, message } = error;
      return res.status(response?.status || 401).json({ message: `Authentication Unsuccessful: ${message}` });
    }

    setToken({ access_token, expires_in });

    token = access_token;
  }

  req.headerConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return next();
};

module.exports = zoomTokenCheck;
