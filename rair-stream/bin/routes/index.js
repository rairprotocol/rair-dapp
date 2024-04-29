const express = require('express');
const v1 = require('./v1');

module.exports = () => {
  const router = express.Router();

  router.use('/v1', v1());
  return router;
};
