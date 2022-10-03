const express = require('express');
const { getLocks } = require('./locks.Service');

const router = express.Router();

router.get('/', getLocks);

module.exports = router;

