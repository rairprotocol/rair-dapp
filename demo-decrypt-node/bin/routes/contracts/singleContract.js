const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { contractAddress } = req;

      const contract = await context.db.Contract.findOne({ contractAddress });

      res.json({ success: true, contract });
    } catch (e) {
      next(e);
    }
  });

  // router.put('/', validation('singleContract', 'params'), validation('updateContract'), async (req, res, next) => {
  //   try {
  //     const { adminNFT: user } = req.user;
  //     const { contractAddress } = req.params;
  //     const contract = await context.db.Contract.findOneAndUpdate({ user, contractAddress }, { ...req.body }, { new: true });
  //
  //     res.json({ success: true, contract });
  //   } catch (e) {
  //     next(e);
  //   }
  // });

  router.delete('/', async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { contractAddress } = req;

      await context.db.Contract.deleteOne({ contractAddress });

      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router
}
