const express = require('express');
const {
  getAllOffers,
  updateOfferData,
  getAvailableTokensInOffer,
} = require('./offers.Service');
const { validation, requireUserSession } = require('../../middleware');

const router = express.Router();

router.get(
  '/',
  validation(['pagination', 'dbOffers'], 'query'),
  getAllOffers,
);
router.get(
  '/:id/available',
  requireUserSession,
  validation(['dbId'], 'params'),
  getAvailableTokensInOffer,
);
router.put(
  '/:id',
  requireUserSession,
  validation(['dbId'], 'params'),
  validation(['dbOffers'], 'body'),
  updateOfferData,
);

module.exports = router;
