const { isAxiosError } = require('axios');
const log = require('../utils/logger')(module);
const { cleanStorage } = require('../utils/helpers');

module.exports = async (err, req, res, next) => {
  // remove temporary files if validation of some middleware was rejected
  try {
    await cleanStorage(req.files || req.file);
  } catch (e) {
    log.error(e);
  }

  if (isAxiosError(err) && err.response) {
    log.error(`AxiosError: ${err.response.data.message}`);

    res
      .status(err.response.status)
      .json({ success: false, error: true, message: err.response.data.message });
    return next();
  }

  log.error(err);
  res.status(500).json({ success: false, error: true, message: err.message });
  return next();
};
