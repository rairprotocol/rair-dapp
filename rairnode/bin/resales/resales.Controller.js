const express = require('express');
const resalesService = require('./resales.Service');

const router = express.Router();

// Use this to filter by contract (query string)
router.get('/', resalesService.getAllResales);
router.get('/customRoyalties', resalesService.getAllCustomRoyalties);
router.get('/:id', resalesService.getResaleById);
// Naming note: custom split === custom royalty
router.get('/byProduct/:productId', resalesService.getResaleByExternalId);
router.get('/byOffer/:offerId', resalesService.getResaleByExternalId);

module.exports = router;
