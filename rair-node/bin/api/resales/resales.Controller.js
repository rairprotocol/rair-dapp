const { Router } = require('express');
const {
  validation,
  requireUserSession,
} = require('../../middleware');
const {
    openResales,
    createResaleOffer,
    updateResaleOffer,
    generatePurchaseRequest,
    deleteResaleOffer,
} = require('./resales.Service');

const router = Router();

router.get(
    '/open',
    validation(['resaleQuery'], 'query'),
    openResales,
);
router.get(
    '/purchase/:id',
    validation(['dbId'], 'params'),
    requireUserSession,
    generatePurchaseRequest,
);
router.post(
    '/create',
    validation(['resaleCreate'], 'body'),
    requireUserSession,
    createResaleOffer,
);
router.put(
    '/update',
    validation(['resaleUpdate'], 'body'),
    requireUserSession,
    updateResaleOffer,
);
router.delete(
    '/delete/:id',
    validation(['dbId'], 'params'),
    requireUserSession,
    deleteResaleOffer,
);

module.exports = router;
