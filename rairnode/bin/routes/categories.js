const express = require('express');

module.exports = (context) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const categories = await context.db.Category.find();

      res.json({ success: true, categories });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
