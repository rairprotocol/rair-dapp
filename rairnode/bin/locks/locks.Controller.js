const express = require('express');
const { getLocks } = require('./locks.Service');

module.exports = () => {
  const router = express.Router();

  router.get('/', getLocks);

  return router;
};
