const express = require('express');
const fileController = require('./file.controller');
const validateController = require('./validate.controller');

module.exports = () => {
  const router = express.Router();

  router.use('/', fileController());
  router.use('/', validateController());

  return router;
};
