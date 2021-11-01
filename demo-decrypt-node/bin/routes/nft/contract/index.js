const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../../../middleware');

module.exports = context => {
  const router = express.Router()

  // Get specific token by contract address and unique toke ID in contract
  router.get('/token/:tokenInContract', async (req, res, next) => {
    try {
      const { contract } = req;
      const { tokenInContract } = req.params;
      const uniqueIndexInContract = Number(tokenInContract);

      const result = await context.db.MintedToken.findOne({ contract, uniqueIndexInContract });

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  router.use('/:product', validation('nftProduct', 'params'), (req, res, next) => {
    req.product = Number(req.params.product);
    next();
  }, require('./product')(context));

  return router;
}
