const express = require('express');
const { validation } = require('../../../middleware');

module.exports = (context) => {
  const router = express.Router();

  // Get specific token by contract id and unique toke ID in contract
  router.get('/token/:tokenInContract', async (req, res, next) => {
    try {
      const { contract } = req;
      const { tokenInContract } = req.params;
      const uniqueIndexInContract = tokenInContract;

      const result = await context.db.MintedToken.findOne({
        contract: contract._id,
        uniqueIndexInContract,
      });

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  // Get all minted tokens from a product
  router.use(
    '/:product',
    validation('nftProduct', 'params'),
    (req, res, next) => {
      req.product = req.params.product;
      return next();
    },
    require('./product')(context),
  );

  return router;
};
