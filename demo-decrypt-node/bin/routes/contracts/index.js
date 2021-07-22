const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  router.post('/', validation('createContract'), async (req, res, next) => {
    try {
      const { adminNFT: user } = req.user;
      const contract = await context.db.Contract.create({ user, ...req.body });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { adminNFT: user } = req.user;
      const contracts = await context.db.Contract.find({ user }, { _id: 1, contractAddress: 1 });

      res.json({ success: true, contracts });
    } catch (e) {
      next(e);
    }
  });

  router.use('/', require('./singleContract')(context));

  return router
}
