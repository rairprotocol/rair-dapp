const express = require('express');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router()

  router.post('/', validation('createUser'), async (req, res, next) => {
    try {
      const { publicAddress, adminNFT } = req.body;
      let user = await context.db.User.create({ publicAddress, adminNFT });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  router.get('/:publicAddress', validation('getUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress;
      const user = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  return router
}
