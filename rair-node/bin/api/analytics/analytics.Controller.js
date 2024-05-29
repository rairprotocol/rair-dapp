const express = require('express');
const { validation, requireUserSession } = require('../../middleware');
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
    getAnalyticsCSVReport,
);

module.exports = router;
