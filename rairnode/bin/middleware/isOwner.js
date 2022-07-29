const log = require('../utils/logger')(module);
const { File } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { publicAddress } = req.user;
    const file = await File.findOne({ _id: req.params.mediaId });

    if (!file) {
      const message = 'File not found..';

      log.error(message);

      return res.status(404).send({ success: false, error: true, message });
    }

    const fileData = file.toObject();

    if (publicAddress !== fileData.authorPublicAddress) {
      const message = 'You don\'t have permission to manage this file.';

      log.error(message);

      return res.status(403).send({ success: false, error: true, message });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
