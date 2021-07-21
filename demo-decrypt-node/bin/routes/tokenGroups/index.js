const express = require('express');
const { validation } = require('../../middleware');

module.exports = context => {
  const router = express.Router()

  router.post('/', validation('createTokenGroup'), async (req, res, next) => {
    try {
      const { adminNFT: user } = req.user;
      const tokenGroup = await context.db.TokenGroup.create({ user, ...req.body });

      res.json({ success: true, tokenGroup });
    } catch (e) {
      next(e);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { adminNFT: user } = req.user;
      const tokenGroups = await context.db.TokenGroup.find({ user }, { _id: 1, tokenGroupAddress: 1 });

      res.json({ success: true, tokenGroups });
    } catch (e) {
      next(e);
    }
  });

  router.use('/', require('./singleTokenGroup')(context));

  return router
}
