const express = require('express')

module.exports = context => {
  const router = express.Router()

  router.post('/', async (req, res) => {
    const { publicAddress, adminNFT } = req.body;
    let user = await context.db.User.create({ publicAddress, adminNFT });

    res.json(user);
  });

  router.get('/:publicAddress', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    const user = await context.db.User.findOne({ publicAddress }, { adminNFT: 0 });

    res.json(user);
  });

  return router
}
