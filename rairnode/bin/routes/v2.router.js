const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');

module.exports = (dbInjection) => {
  const router = express.Router();
  router.use('/search', searchController(dbInjection));
  router.use('/contracts', contractsController(dbInjection));

  return router;
};
