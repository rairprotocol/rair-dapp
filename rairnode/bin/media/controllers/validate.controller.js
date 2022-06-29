const express = require('express');
const _ = require('lodash');
const { validateData } = require('../upload.service.');

module.exports = () => {
  const router = express.Router();

  router.get('/validate', validateData);

  return router;
};
