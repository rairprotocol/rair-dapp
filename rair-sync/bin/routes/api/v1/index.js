const express = require('express');
const transactions = require('./transactions');

module.exports = (context) => {
  const router = express.Router();
  router.use('/transaction', transactions(context));

  return router;
};
