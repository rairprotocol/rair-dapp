const express = require('express');
const { validation } = require('../middleware');

module.exports = (context) => {
  const router = express.Router();

  router.post('/', validation('search'), async (req, res, next) => {
    try {
      const {
        searchBy = 'users', blockchain = '', category = '', searchString = '',
      } = req.body;
      const searchQuery = { query: searchString };
      let result;

      const foundCategory = await context.db.Category.findOne({ name: category });

      if (foundCategory) {
        searchQuery.category = foundCategory._id;
      }

      const foundBlockchain = await context.db.Blockchain.findOne({ hash: blockchain });

      if (foundBlockchain) {
        const arrayOfContracts = await context.db.Contract.find({ blockchain }).distinct('_id');
        searchQuery.contract = { $in: arrayOfContracts };
      }

      switch (searchBy) {
        case 'users':
          result = await context.db.User.search({ query: searchString });
          break;
        case 'products':
          result = await context.db.Product.search(searchQuery);
          break;
        case 'files':
          result = await context.db.File.search(searchQuery);
          break;
        default:
          result = await context.db.User.search({ query: searchString });
          break;
      }

      return res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
