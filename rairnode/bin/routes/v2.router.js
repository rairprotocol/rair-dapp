const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');
const productsController = require('../products/product.Controller');

module.exports = (dbInjection) => {
  const router = express.Router();
  router.use('/search', searchController(dbInjection));
  router.use('/contracts', contractsController(dbInjection));
  router.use('/products', productsController(dbInjection));

  return router;
};
