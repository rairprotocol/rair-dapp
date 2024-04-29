const axios = require('axios');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['x-rair-token'];
    const userAdmin = await axios.get(
      `${config.rairnode.baseUri}/api/v2/verify/jwt`,
      {
        headers: {
          'x-rair-token': token,
        },
      },
    );

    req.user = userAdmin.data;
    return next();
  } catch (e) {
    return next(e);
  }
};
