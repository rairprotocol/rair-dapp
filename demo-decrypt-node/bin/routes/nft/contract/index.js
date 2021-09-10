const express = require('express');

module.exports = context => {
  const router = express.Router()

  router.get('/token/:tokenInContract', async (req, res, next) => {
    try {
      const { contract } = req;
      const { tokenInContract } = req.params;
      const uniqueIndexInContract = parseInt(tokenInContract);

      const result = await context.db.MintedToken.findOne({ contract, uniqueIndexInContract });

      res.json({ success: true, result });
    } catch (err) {
      next(err);
    }
  });

  router.use('/:product', (req, res, next) => {
    req.product = req.params.product;
    next();
  }, require('./product')(context));

  return router;
}
