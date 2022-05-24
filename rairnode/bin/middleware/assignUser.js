const jwt = require('jsonwebtoken');
const log = require('../utils/logger')(module);

module.exports = (context) => async (req, res, next) => {
  try {
    const token = req.headers['x-rair-token'];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await context.db.User.findOne({ publicAddress: decoded.eth_addr }, { nonce: 0 });

      if (user) {
        req.user = user.toObject();
        return next();
      }
    }

    req.user = null;

    return next();
  } catch (err) {
    log.warn(err);

    req.user = null;

    return next();
  }
};
