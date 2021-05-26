const express = require('express')

module.exports = context => {
  const router = express.Router()

  router.post('/', async (req, res) => {
    const { publicAddress, adminNFT } = req.body;
    await context.db.User.create({ publicAddress, adminNFT });
    res.sendStatus(200);
  });

  router.get('/:publicAddress', async (req, res) => {
    const publicAddress = req.params.publicAddress;
    const user = await context.db.User.findOne({ publicAddress });

    if (!user) {
      console.log(`User with publicAddress ${ publicAddress } is not found in database`);
      return res.status(400).send({
        error: `User with publicAddress ${publicAddress} is not found in database`,
      });
    }

    res.json(user);
  });

  return router
}
