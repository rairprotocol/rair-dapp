const express = require('express');
const {
  getTransaction,
} = require('../../../integrations/ethers/transactionCatcher');

module.exports = (context) => {
  const router = express.Router();

  router.post('/:network/:hash', async (req, res, next) => {
    try {
      const { network, hash } = req.params;
      const verificationData = await context.redis.redisService.get(`${network}:${hash}`);
      if (!network || !hash) {
        res.json({ success: false, message: 'Missing data' });
      }
      const result = await getTransaction(
        network,
        hash,
        verificationData
      );
      res.json({ success: result !== undefined, foundEvents: result });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
