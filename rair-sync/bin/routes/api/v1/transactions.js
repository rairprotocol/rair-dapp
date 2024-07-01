const { Router } = require('express');
const {
  getTransaction,
} = require('../../../integrations/ethers/transactionCatcher');
const { redisClient } = require('../../../services/redis');

const router = Router();

router.post('/:network/:hash', async (req, res, next) => {
  try {
    const { network, hash } = req.params;
    const userData = await redisClient.get(`${network}:${hash}`);
    console.info(userData);
    if (!network || !hash) {
      res.json({ success: false, message: 'Missing data' });
    }
    const result = await getTransaction(
      network,
      hash,
      userData,
    );
    res.json({ success: result !== undefined, foundEvents: result });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
