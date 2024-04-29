module.exports = async (req, res, next) => {
  try {
    const token = req.headers['x-rair-token'];
    const redisUserData = await req.redisService.get(token);
    await req.redisService.set(token, {});
    req.user = redisUserData;
    return next();
  } catch (e) {
    return next(e);
  }
};
