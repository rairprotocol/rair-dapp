const { Router } = require('express');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
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
    createCategory,
);

router.put(
    '/:id',
    validation(['dbCategory'], 'body'),
    validation(['dbId'], 'params'),
    requireUserSession,
    verifySuperAdmin,
    updateCategory,
);

router.delete(
    '/:id',
    validation(['dbId'], 'params'),
    requireUserSession,
    verifySuperAdmin,
    deleteCategory,
);

module.exports = router;
