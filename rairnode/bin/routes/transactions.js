const express = require('express');
const axios = require('axios');
const { JWTVerification } = require('../middleware');
// eslint-disable-next-line no-unused-vars
module.exports = (context) => {
  const router = express.Router();

  router.post('/:network/:hash', JWTVerification, async (req, res, next) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.BASE_BCN_URL}/api/v1/transaction/${req.params.network}/${req.params.hash}`,
        headers: req.headers,
        // params: req.params,
        body: req.body,
      });
      res.json({
        success: response.data.success,
        foundEvents: response.data.foundEvents,
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
