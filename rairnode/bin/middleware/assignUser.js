const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    return next(err);
  }
};
