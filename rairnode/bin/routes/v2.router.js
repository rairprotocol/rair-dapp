const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');
const productsController = require('../products/product.Controller');
const tokensController = require('../tokens/tokens.Controller');
const { JWTVerification } = require('../middleware');

module.exports = (dbInjection) => {
  const router = express.Router();
  router.use('/search', searchController(dbInjection));
  router.use('/contracts', contractsController(dbInjection));
  router.use('/products', productsController(dbInjection));
  router.use('/tokens', JWTVerification, tokensController());

  return router;
};
