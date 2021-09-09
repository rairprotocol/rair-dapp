const express = require('express');

module.exports = context => {
  const router = express.Router()

  router.use('/:product', (req, res, next) => {
    req.product = req.params.product;
    next();
  }, require('./product')(context));

  return router;
}
