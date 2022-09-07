const { User } = require('../models');
const AppError = require('../utils/appError');
const eFactory = require('../utils/entityFactory');

exports.getAllUsers = eFactory.getAll(User);
exports.getUserById = eFactory.getOne(User);

// for Contract service to enrich data with User Address
exports.addUserAdressToFilterById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new AppError('No user with such ID', 404));
    }
    req.query.user = user.publicAddress;
    next();
  } catch (err) {
    next(err);
  }
};
