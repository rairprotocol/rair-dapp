const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');
const productsController = require('../products/product.Controller');
const tokensController = require('../tokens/tokens.Controller');
const { JWTVerification } = require('../middleware');

module.exports = () => {
  const router = express.Router();
  router.use('/search', searchController);
  router.use('/contracts', contractsController);
  router.use('/products', productsController);
  router.use('/tokens', JWTVerification, tokensController());

  return router;
};
