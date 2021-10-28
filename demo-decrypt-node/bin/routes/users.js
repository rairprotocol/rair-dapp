const express = require('express');
const _ = require('lodash');
const { validation } = require('../middleware');
const { nanoid } = require('nanoid');

module.exports = context => {
  const router = express.Router()

  router.post('/', validation('createUser'), async (req, res, next) => {
    try {
      let { publicAddress, adminNFT } = req.body;

      if (adminNFT === 'temp') {
        adminNFT = `temp_${nanoid()}`; //FIXME: should be removed right after fix the frontend functionality
      }

      publicAddress = publicAddress.toLowerCase();

      let user = await context.db.User.create({ publicAddress, adminNFT });

      res.json({ success: true, user: _.omit(user, ['nonce']) });
    } catch (e) {
      next(e);
    }
  });

  router.get('/:publicAddress', validation('singleUser', 'params'), async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const user = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  router.put('/:publicAddress', validation('updateUser'), validation('singleUser', 'params'),  async (req, res, next) => {
    try {
      const publicAddress = req.params.publicAddress.toLowerCase();
      const adminNFT = req.body.adminNFT;
      const foundUser = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

      if (!foundUser) {
        res.status(404).send({ success: false, message: 'User not found.' });
      }

      const user = await context.db.User.findOneAndUpdate({ publicAddress }, { adminNFT }, { new: true });

      res.json({ success: true, user });
    } catch (e) {
      next(e);
    }
  });

  return router
}
