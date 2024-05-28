const { Router } = require('express');
const { requireUserSession } = require('../../middleware');
const { processUserTransaction } = require('./transactions.Service');
const router = Router();

router.post(
    '/:network/:hash',
    requireUserSession,
    processUserTransaction
);

module.exports = router;
