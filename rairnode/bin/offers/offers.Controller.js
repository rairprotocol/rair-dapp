const express = require('express');
const offerService = require('./offers.Service');
const {
  getContractsByBlockchainAndContractAddress,
} = require('../contracts/contracts.Service');

const router = express.Router();

router.get('/', offerService.getAllOffers);
router.get(
  '/byAddressAndProduct/',
  offerService.validateQueryProduct,
  async (req, res, next) => {
    if (!req.query.contract) {
      await getContractsByBlockchainAndContractAddress(req, res, next);
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
router.get('/:id', offerService.getOfferById);
module.exports = router;
