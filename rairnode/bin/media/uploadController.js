const express = require('express');
const { addFile, validateData, getUploadToken } = require('./upload.service');

const router = express.Router();

router.get('/validate', validateData);
router.post('/file', addFile);
router.get('/token', getUploadToken);

module.exports = router;
