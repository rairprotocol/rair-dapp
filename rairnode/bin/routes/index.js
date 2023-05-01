/* eslint-disable global-require */
const express = require('express');
const searchController = require('../api/search/search.Controller');
const v2 = require('./v2.router');
const analyticsRoutes = require('../api/analytics/analytics.Controller');
const creditController = require('../api/credits/credits.Controller');

module.exports = (context) => {
  const router = express.Router();
  router.use('/v2', v2());
  router.use('/auth', require('./auth')(context));
  router.use('/docs', require('./swagger'));
  router.use('/media', require('./media')());
  router.use('/users', require('./users')(context));
  router.use('/contracts', require('./contracts')(context));
  router.use('/nft', require('./nft')(context));
  router.use('/blockchains', require('./blockchains')(context));
  router.use('/categories', require('./categories')(context));
  router.use('/transaction', require('./transactions')(context));
  router.use('/analytics', analyticsRoutes);
  router.use('/credits', creditController);

  // Searches ->
  router.use('/search', searchController);

  // Custom temporary endpoint for the monaco2021
  router.use('/', require('./monaco2021')(context));

  return router;
};
