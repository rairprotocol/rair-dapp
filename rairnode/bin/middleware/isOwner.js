const _ = require('lodash');
const AppError = require('../utils/errors/AppError');
const log = require('../utils/logger')(module);

module.exports = (Model) => async (req, res, next) => {
  try {
    const { publicAddress } = req.user;
    const { mediaId, id } = req.params;
    const itemsToCompare = ['authorPublicAddress', 'userAddress'];

    let foundItem = await Model.findById(mediaId || id);

    if (!foundItem) {
      const message = 'Data not found.';

      log.error(message);

      return next(new AppError(`${message}`, 404));
    }

    foundItem = foundItem.toObject();

    const owner = _.chain(itemsToCompare)
      .map((i) => _.get(foundItem, i, null))
      .includes(publicAddress)
      .value();

    if (!owner) {
      const message = 'You don\'t have permission to manage this data.';

      log.error(message);

      return next(new AppError(`${message}`, 403));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
