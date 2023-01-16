const AppError = require('../utils/errors/AppError');
const log = require('../utils/logger')(module);

module.exports = async (req, res, next) => {
  const sess = req.session;

  if (!sess.media_id || !sess.streamAuthorized) {
    sess.destroy((err) => {
      log.info('sess destroyed');
      if (err) {
        return next(err);
      }

      return !sess.streamAuthorized
        ? next(new AppError('User is not authorized.', 403))
        : next(new AppError('Invalid session data.', 400));
    });
  }

  return next();
};
