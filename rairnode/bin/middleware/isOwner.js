const _ = require('lodash');
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

      return res.status(404).send({ success: false, error: true, message });
    }

    foundItem = foundItem.toObject();

    const owner = _.chain(itemsToCompare)
      .map((i) => _.get(foundItem, i, null))
      .includes(publicAddress)
      .value();

    if (!owner) {
      const message = 'You don\'t have permission to manage this data.';

      log.error(message);

      return res.status(403).send({ success: false, error: true, message });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
