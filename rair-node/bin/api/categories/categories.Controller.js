const { Router } = require('express');
const {
    updateCategories,
    getCategories,
} = require('./categories.Service');
const { requireUserSession } = require('../../middleware/verifyUserSession');
const validation = require('../../middleware/validation');
const { verifySuperAdmin } = require('../../middleware');

const router = Router();

router.get(
    '/',
    getCategories,
);

router.post(
    '/',
    validation(['dbCategory'], 'body'),
    requireUserSession,
    verifySuperAdmin,
    updateCategories,
    getCategories,
);

module.exports = router;
