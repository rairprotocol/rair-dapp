const express = require('express');
const { addFile, validateData } = require('./upload.service');

const router = express.Router();

router.get('/validate', validateData);
router.post('/file', addFile);

module.exports = router;
