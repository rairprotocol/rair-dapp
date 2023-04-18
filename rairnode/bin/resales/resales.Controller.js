const express = require('express');
const resalesService = require('./resales.Service');
const { validation } = require('../middleware');

const router = express.Router();

// Use this to filter by contract (query string)
router.get(
    '/',
    validation(['pagination', 'dbResales'], 'query'),
    resalesService.getAllResales,
);
router.get(
    '/customRoyalties',
    validation(['pagination', 'dbRoyalties'], 'query'),
    resalesService.getAllCustomRoyalties,
);
router.get(
    '/:id',
    validation(['dbId'], 'params'),
    resalesService.getResaleById,
);
// Naming note: custom split === custom royalty
router.get(
    '/byProduct/:productId',
    validation(['productId'], 'params'),
    resalesService.getResaleByExternalId,
);
router.get(
    '/byOffer/:offerId',
    validation(['offerId'], 'params'),
    resalesService.getResaleByExternalId,
);

module.exports = router;
