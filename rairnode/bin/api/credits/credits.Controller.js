const { Router } = require('express');
const searchService = require('./credits.Service');
const { requireUserSession } = require('../../middleware/verifyUserSession');
const validation = require('../../middleware/validation');

const router = Router();
router.get(
    '/:blockchain/:tokenAddress',
    validation('tokenCreditQuery', 'params'),
    requireUserSession,
    searchService.getUserCredits,
);
router.post(
    '/withdraw',
    validation('tokenCreditWithdraw', 'body'),
    requireUserSession,
    searchService.generateWithdrawRequest,
);

module.exports = router;
