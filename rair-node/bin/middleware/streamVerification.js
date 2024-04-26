const AppError = require('../utils/errors/AppError');
const log = require('../utils/logger')(module);

module.exports = async (req, res, next) => {
  const { session } = req;

  if (!session.authorizedMediaStream) {
    return next(new AppError('Invalid file data in session', 400));
  }

  return next();
};
