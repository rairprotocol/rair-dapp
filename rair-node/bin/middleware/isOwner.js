const AppError = require('../utils/errors/AppError');

module.exports = (Model) => async (req, res, next) => {
  try {
    const { publicAddress, superAdmin } = req.user;
    const { mediaId, id } = req.params;
    const itemsToCompare = ['uploader', 'userAddress'];

    let foundItem = await Model.findById(mediaId || id);

    if (!foundItem) {
      return next(new AppError('Data not found.', 404));
    }

    foundItem = foundItem.toObject();

    const owner = superAdmin || itemsToCompare.map((i) => foundItem[i]).includes(publicAddress);

    if (!owner) {
      return next(new AppError('You don\'t have permission to manage this data.', 403));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
