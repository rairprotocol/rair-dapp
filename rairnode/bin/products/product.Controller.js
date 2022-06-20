const express = require('express');
const productService = require('./product.Service');

module.exports = () => {
  const router = express.Router();
  // TODO: MB:
  // router.get(
  //   '/',
  //   contractService.getAllContracts(dbInjection.db.Contract),
  // ); -> getMyContracts
  // +getFullContracts

  router.get('/user/:userAddress', productService.getProductsByUser);
  router.get('/:productId', productService.getProductById);
  return router;
};
