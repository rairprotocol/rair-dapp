const express = require('express');
const { JWTVerification } = require('../middleware');

module.exports = context => {
  const router = express.Router();
  router.use('/auth', require('./auth')(context));
  router.use('/docs', require('./swagger'));
  router.use('/media', require('./media')(context));
  router.use('/users', require('./users')(context));
  router.use('/contracts', JWTVerification(context), require('./contracts')(context));
  router.use('/products', JWTVerification(context), require('./products')(context));
  router.use('/nft',/* JWTVerification(context),*/ require('./nft')(context));
  return router;
};
