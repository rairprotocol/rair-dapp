const express = require('express');
const {
  getAllOffers,
  getOffersAndLocks,
  getOfferById,
} = require('./offers.Service');
const { validation } = require('../../middleware');

const router = express.Router();

router.get(
  '/',
  validation(['pagination', 'dbOffers'], 'query'),
  getAllOffers,
);

router.get(
  '/locks',
  validation(['dbOffers'], 'query'),
  getOffersAndLocks,
);

router.get(
  '/:id',
  validation(['dbId'], 'params'),
  getOfferById,
);
module.exports = router;
