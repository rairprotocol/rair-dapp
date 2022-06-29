const express = require('express');
const uploadController = require('../upload/upload.controller');

module.exports = () => {
  const router = express.Router();

  router.use('/media', uploadController());
  return router;
};
