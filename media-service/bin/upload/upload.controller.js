const express = require('express');
const upload = require('../Multer/Config');

const {
  validation,
  formDataHandler,
  verification,
} = require('../middleware');
const { uploadMedia } = require('./upload.service');

module.exports = () => {
  const router = express.Router();

  router.post(
    '/upload',
    verification,
    upload.single('video'),
    validation('uploadVideoFile', 'file'),
    formDataHandler,
    validation('uploadVideo'),
    uploadMedia,
  );

  return router;
};
