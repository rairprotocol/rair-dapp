const express = require('express');
const { validation, requireUserSession, consumeTokenCredit } = require('../../middleware');
const { getAnalyticsData, getAnalyticsCSVReport } = require('./analytics.Server');

const router = express.Router();

router.get(
    '/:mediaId',
    requireUserSession,
    validation(['analyticsParams'], 'params'),
    validation(['analyticsQuery', 'pagination'], 'query'),
    getAnalyticsData,
);
router.get(
    '/:mediaId/csv',
    requireUserSession,
    validation(['analyticsParams'], 'params'),
    validation(['analyticsQuery'], 'query'),
    consumeTokenCredit('0x5', '100000000'),
    getAnalyticsCSVReport,
);

module.exports = router;
