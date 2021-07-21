const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  router.get('/:tokenGroupAddress', validation('singleTokenGroup', 'params'), async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { tokenGroupAddress } = req.params;
      const tokenGroup = await context.db.TokenGroup.findOne({ tokenGroupAddress });

      res.json({ success: true, tokenGroup });
    } catch (e) {
      next(e);
    }
  });

  // router.put('/:tokenGroupAddress', validation('singleTokenGroup', 'params'), validation('updateTokenGroup'), async (req, res, next) => {
  //   try {
  //     const { adminNFT: user } = req.user;
  //     const { tokenGroupAddress } = req.params;
  //     const contract = await context.db.TokenGroup.findOneAndUpdate({ user, tokenGroupAddress }, { ...req.body }, { new: true });
  //
  //     res.json({ success: true, contract });
  //   } catch (e) {
  //     next(e);
  //   }
  // });

  router.delete('/:tokenGroupAddress', validation('singleTokenGroup', 'params'), async (req, res, next) => {
    try {
      // const { adminNFT: user } = req.user;
      const { tokenGroupAddress } = req.params;
      await context.db.TokenGroup.deleteOne({ tokenGroupAddress });

      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  });

  return router
}
