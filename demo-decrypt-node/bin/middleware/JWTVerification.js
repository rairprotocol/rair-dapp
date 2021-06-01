const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = (context) => async (req, res, next) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = (await context.db.User.findOne({ publicAddress: decoded.eth_addr }, { nonce: 0, adminNFT: 0 })).toObject();

    if (!user) {
      return next(new Error('User with provided Token is not found in database'));
    }

    req.user = _.assign(user, { adminRights: decoded.adminRights });

    return next();
  } catch(err) {
    return next(err);
  }
}
