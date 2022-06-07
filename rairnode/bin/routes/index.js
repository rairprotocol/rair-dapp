const express = require('express');
const _ = require('lodash');
const searchController = require('../search/search.Controller');
const v2 = require('./v2.router');

module.exports = (context) => {
  const router = express.Router();
  const v2Context = _.pick(context, 'db');
  router.use('/v2', v2(context, 'db')); // inject only db
  router.use('/auth', require('./auth')(context));
  router.use('/docs', require('./swagger'));
  router.use('/media', require('./media')(context));
  router.use('/users', require('./users')(context));
  router.use('/contracts', require('./contracts')(context));
  router.use('/nft', require('./nft')(context));
  router.use('/blockchains', require('./blockchains')(context));
  router.use('/categories', require('./categories')(context));
  router.use('/transaction', require('./transactions')(context));

  // Searches ->
  router.use('/search', searchController(v2Context));

  // Custom temporary endpoint for the monaco2021
  router.use('/', require('./monaco2021')(context));

  return router;
};
