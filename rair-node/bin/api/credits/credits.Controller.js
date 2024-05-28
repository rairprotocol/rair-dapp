const { Router } = require('express');
const { getUserCredits, generateWithdrawRequest } = require('./credits.Service');
const { requireUserSession } = require('../../middleware/verifyUserSession');
const validation = require('../../middleware/validation');

const router = Router();

router.get(
    '/:blockchain/:tokenAddress',
    validation(['tokenCreditQuery'], 'params'),
    requireUserSession,
    getUserCredits,
);
router.post(
    '/withdraw',
    validation(['tokenCreditWithdraw'], 'body'),
    requireUserSession,
    generateWithdrawRequest,
);

module.exports = router;
