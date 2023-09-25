/* eslint-disable global-require */
const express = require('express');
const searchController = require('../api/search/search.Controller');
const v2 = require('./v2.router');
const analyticsController = require('../api/analytics/analytics.Controller');
const creditController = require('../api/credits/credits.Controller');
const settingsRouter = require('../api/settings/settings.Controller');
const resalesController = require('../api/resales/resales.Controller');

module.exports = (context) => {
  const router = express.Router();
  router.use('/v2', v2());
  router.use('/auth', require('./auth')(context));
  router.use('/docs', require('./swagger'));
  router.use('/media', require('./media')());
  router.use('/users', require('./users')(context));
  router.use('/contracts', require('./contracts')(context));
  router.use('/nft', require('./nft')(context));
  router.use('/categories', require('./categories')(context));
  router.use('/transaction', require('./transactions')(context));
  router.use('/analytics', analyticsController);
  router.use('/credits', creditController);
  router.use('/settings', settingsRouter);
  router.use('/resales', resalesController);

  // Searches ->
  router.use('/search', searchController);

  // Custom temporary endpoint for the monaco2021
  router.use('/', require('./monaco2021')(context));

  return router;
};
