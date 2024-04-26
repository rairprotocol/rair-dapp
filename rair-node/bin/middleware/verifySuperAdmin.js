const AppError = require('../utils/errors/AppError');

module.exports = async (req, res, next) => {
  const { superAdmin } = req.user;

  if (!superAdmin) {
    return next(new AppError('SuperAdmin right is required', 403));
  }

  return next();
};
