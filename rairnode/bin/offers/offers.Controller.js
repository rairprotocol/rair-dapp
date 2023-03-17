const express = require('express');
const offerService = require('./offers.Service');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const { validation } = require('../middleware');

const router = express.Router();

router.get(
  '/',
  validation('pagination', 'query'),
  validation('dbOffers', 'query'),
  offerService.getAllOffers,
);

router.get(
  '/byAddressAndProduct/',
  validation('withProductV2', 'query'),
  async (req, res, next) => {
    if (!req.query.contract) {
      await getSpecificContracts(req, res, next);
    } else {
      next();
    }
  },
  async (req, res, next) => {
    req.query.contractAddress = undefined;
    req.query.networkId = undefined;
    next();
  },
  offerService.getAllOffers,
);

router.get(
  '/:id',
  validation('dbId', 'params'),
  offerService.getOfferById,
);
module.exports = router;
