const express = require('express');

module.exports = context => {
  const router = express.Router();
  router.use('/auth', require('./auth')(context));
  router.use('/docs', require('./swagger'));
  router.use('/media', require('./media')(context));
  router.use('/users', require('./users')(context));
  router.use('/contracts', require('./contracts')(context));
  router.use('/nft', require('./nft')(context));
  router.use('/blockchains', require('./blockchains')(context));
  router.use('/categories', require('./categories')(context));

  // Custom temporary endpoint for the monaco2021
  router.use('/', require('./monaco2021')(context));

  return router;
};
