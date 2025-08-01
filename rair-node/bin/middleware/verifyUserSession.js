const { User } = require('../models');
const AppError = require('../utils/errors/AppError');

module.exports = {
  requireUserSession: async (req, res, next) => {
    try {
      if (!req.auth) {
        return req.session.destroy(() => next(new AppError('Authentication failed, please login again'), 403));
      }
      const document = await User.findById(req.auth.id).lean();
      if (document) {
        req.user = { ...document, superAdmin: req.auth.superAdmin };
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
      if (req.auth) {
        const document = await User.findById(req.auth.id).lean();
        if (document) {
          req.user = { ...document, superAdmin: req.auth.superAdmin };
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
