const log = require('../utils/logger')(module);

module.exports = (context) => async (req, res, next) => {
  try {
    const { adminNFT: author } = req.user;
    const reg = new RegExp(/^0x\w{40}:\w+$/);
    const fileData = (await context.db.File.findOne({ _id: req.params.mediaId })).toObject();

    if (!author || !reg.test(author) || author !== fileData.author) {
      const message = 'You don\'t have permission to manage this file.';

      log.error(message);

      return res.status(403).send({ success: false, error: true, message });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
