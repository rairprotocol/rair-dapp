const { User } = require('../models');
const AppError = require('../utils/errors/AppError');

module.exports = {
  requireUserSession: async (req, res, next) => {
    try {
      if (!req?.session?.userData) {
        return next(new AppError('Authentication failed, please login again'), 403);
      }
      // Sanity check
      if (await User.findById(req.session.userData._id)) {
        req.user = req.session.userData;
      } else {
        return next(new AppError('Authentication failed'), 403);
      }
      return next();
    } catch (err) {
      return next(err);
    }
  },
  loadUserSession: async (req, res, next) => {
    try {
      if (req?.session?.userData) {
        // Sanity check
        if (await User.findById(req.session.userData._id)) {
          req.user = req.session.userData;
        } else {
          return next(new AppError('Authentication failed'), 403);
        }
      }
      return next();
    } catch (err) {
      return next(err);
    }
  },
};
