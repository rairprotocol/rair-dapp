const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');
const uploadController = require('../media/uploadController');
const productsController = require('../products/product.Controller');
const tokensController = require('../tokens/tokens.Controller');
const locksController = require('../locks/locks.Controller');
const resalesController = require('../resales/resales.Controller');
const offersController = require('../offers/offers.Controller');
const usersController = require('../users/users.Controller');
const verifyController = require('../verification/userVerification.controller');
const favoritesController = require('../favorites/favorites.Controller');
const { JWTVerification } = require('../middleware');

module.exports = () => {
  const router = express.Router();
  router.use('/search', searchController);
  router.use('/contracts', contractsController);
  router.use('/products', productsController);
  router.use('/tokens', tokensController());
  router.use('/locks', locksController());
  router.use('/favorites', JWTVerification, favoritesController());
  router.use('/verify', verifyController());
  router.use('/upload', uploadController());
  router.use('/users', usersController);
  router.use('/offers', offersController);
  router.use('/resales', resalesController);
  return router;
};
