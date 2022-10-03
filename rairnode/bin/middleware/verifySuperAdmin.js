const AppError = require('../utils/errors/AppError');

module.exports = async (req, res, next) => {
  const { superAdmin } = req.user;

  if (!superAdmin) {
    return next(new AppError('For manage contract superAdmin right is require', 403));
  }

  req.user = superAdmin;

  return next();
};
