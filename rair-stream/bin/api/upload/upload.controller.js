const express = require('express');
const upload = require('../../Multer/Config');

const {
  validation,
  formDataHandler,
  verification,
} = require('../../middleware');
const { uploadMedia, validateForDemo, hardcodedDemoData } = require('./upload.service');

const router = express.Router();

router.post(
  '/demo',
  verification,
  upload.single('video'),
  validateForDemo,
  validation('uploadVideoFile', 'file'),
  formDataHandler,
  hardcodedDemoData,
  validation('uploadVideo'),
  uploadMedia,
);

router.post(
  '/',
  verification,
  upload.single('video'),
  validation('uploadVideoFile', 'file'),
  formDataHandler,
  validation('uploadVideo'),
  uploadMedia,
);

module.exports = router;
