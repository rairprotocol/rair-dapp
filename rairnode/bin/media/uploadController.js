const express = require('express');
const { validation } = require('../middleware');
const { addFile, validateData, getUploadToken } = require('./upload.service');

const router = express.Router();

router.get(
    '/validate',
    validation(['validateMediaData'], 'query'),
    validateData,
);
router.post(
    '/file',
    validation(['addFileFromMediaService'], 'body'),
    addFile,
);
router.get('/token', getUploadToken);

module.exports = router;
