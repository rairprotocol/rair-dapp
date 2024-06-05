const { redisClient } = require('../services/redis');
const AppError = require('../utils/errors/AppError');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['x-rair-token'];
    const redisUserData = await redisClient.getDel(token);
    if (redisUserData) {
      req.user = JSON.parse(redisUserData);
      return next();
    }
    return next(new AppError('Invalid user information'));
  } catch (e) {
    return next(e);
  }
};
