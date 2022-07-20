const express = require('express');
const offerService = require('./offers.Service');

const router = express.Router();

router.get('/', offerService.getAllOffers);
router.get('/:id', offerService.getOfferById);
module.exports = router;
