const express = require('express');
const { getTransaction } = require('../integrations/ethers/transactionCatcher.js');
const { JWTVerification } = require('../middleware');

module.exports = (context) => {
  const router = express.Router();

  router.post('/:network/:hash', JWTVerification(context), async (req, res, next) => {
    try {
      const { network, hash } = req.params;
      if (!network || !hash) {
        res.json({ success: false, message: 'Missing data' });
      }
      const result = await getTransaction(network, hash, req.user.publicAddress, context.db);
      res.json({ success: result !== undefined, foundEvents: result });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
