const express = require('express');
const { getLocks } = require('./locks.Service');
const { validation } = require("../middleware");

const router = express.Router();

router.get('/', validation('getLocksByProduct', 'query'), getLocks);

module.exports = router;

