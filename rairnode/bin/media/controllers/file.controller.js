const express = require('express');
const { addFile } = require('../upload.service.');

module.exports = () => {
  const router = express.Router();

  router.post('/file', addFile);

  return router;
};
