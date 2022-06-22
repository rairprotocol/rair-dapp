const express = require('express');
const { createTokensWithCommonMetadata } = require('./tokens.Service');
const upload = require('../Multer/Config');
const { dataTransform, validation } = require('../middleware');

module.exports = () => {
  const router = express.Router();
  router.post(
    '/',
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('createCommonTokenMetadata'),
    createTokensWithCommonMetadata,
  );

  return router;
};
