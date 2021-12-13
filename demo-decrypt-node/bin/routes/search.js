const express = require('express');
const _ = require('lodash');
const { JWTVerification, validation } = require('../middleware');
const { nanoid } = require('nanoid');

module.exports = context => {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      const { pageNum = 1, filesPerPage = 10, blockchain = '', category = '', sortBy = 'creationDate', sort = -1, searchString } = req.body;

      const files = await context.db.File.find({ $text: { $search: searchString } }, { key: 0 })
      const products = await context.db.Product.find({ $text: { $search: searchString } })
      let users = await context.db.User.find({ $text: { $search: searchString } });

      res.json({ success: true, result: { users, products, files } });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
