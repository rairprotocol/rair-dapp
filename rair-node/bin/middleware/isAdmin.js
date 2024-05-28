const AppError = require('../utils/errors/AppError');

module.exports = (req, res, next) => {
  try {
    const { adminRights, publicAddress } = req.user;

    if (!adminRights) {
      return next(new AppError(`User ${publicAddress} don't have admin rights.`, 401));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
