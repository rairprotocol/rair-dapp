module.exports = (context) => async (req, res, next) => {
  const cleanData = async sessionData => {
    sessionData.streamAuthorized = false;
    delete sessionData.media_id;
    await context.redis.redisService.set(`sess:${req.sessionID}`, sessionData);
  }

  try {
    const sessionData = await context.redis.redisService.get(`sess:${req.sessionID}`);

    if (!sessionData) return next(new Error('Invalid session data.'));

    if (!sessionData.media_id) {
      await cleanData(sessionData);
      return next(new Error('Invalid session data.'));
    }

    if (!sessionData.streamAuthorized) {
      await cleanData(sessionData);
      return next(new Error('User is not authorized.'));
    }

    return next();
  } catch(err) {
    return next(err);
  }
}
