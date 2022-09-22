const AppError = require('../utils/errors/AppError');

module.exports = (context) => async (req, res, next) => {
  const cleanData = async (sessionData) => {
    // eslint-disable-next-line no-param-reassign
    sessionData.streamAuthorized = false;
    // eslint-disable-next-line no-param-reassign
    delete sessionData.media_id;
    await context.redis.redisService.set(`sess:${req.sessionID}`, sessionData);
  };

  try {
    const sessionData = await context.redis.redisService.get(`sess:${req.sessionID}`);

    if (!sessionData) return next(new AppError('Invalid session data.', 400));

    if (!sessionData.media_id) {
      await cleanData(sessionData);
      return next(new AppError('Invalid session data.', 400));
    }

    if (!sessionData.streamAuthorized) {
      await cleanData(sessionData);
      return next(new AppError('User is not authorized.', 403));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
