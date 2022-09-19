const express = require('express');
const { getFiles } = require('./files.Service');
const { assignUser } = require('../middleware');

const router = express.Router();

router.get('/', assignUser, getFiles);
module.exports = router;
