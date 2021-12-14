const express = require('express');
const { validation } = require('../middleware');

module.exports = context => {
  const router = express.Router();

  router.post('/', validation('search'), async (req, res, next) => {
    try {
      const { searchBy = 'users', blockchain = '', category = '', searchString } = req.body;
      const searchQuery = { $text: { $search: searchString } };
      let result;

      const foundCategory = await context.db.Category.findOne({ name: category });

      if (foundCategory) {
        searchQuery.category = foundCategory._id;
      }

      const foundBlockchain = await context.db.Blockchain.findOne({ hash: blockchain });

      if (foundBlockchain) {
        const arrayOfContracts = await context.db.Contract.find({ blockchain }).distinct('contractAddress');
        searchQuery.contract = { $in: arrayOfContracts };
      }

      switch (searchBy) {
        case 'users':
          result = await context.db.User.find({ $text: { $search: searchString } }).sort({ nickName: 1 });
          break;
        case 'products':
          result = await context.db.Product.find(searchQuery).sort({ ['products.name']: 1 });
          break;
        case 'files':
          result = await context.db.File.find(searchQuery, { key: 0 }).sort({ title: 1 });
          break;
        default:
          result = await context.db.User.find({ $text: { $search: searchString } }).sort({ nickName: 1 });
          break;
      }

      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
