const express = require('express');

module.exports = (context) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const blockchains = await context.db.Blockchain.find();

      res.json({ success: true, blockchains });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
