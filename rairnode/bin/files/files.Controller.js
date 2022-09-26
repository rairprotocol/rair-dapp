const express = require('express');
const { getFiles, getFilesForToken } = require('./files.Service');
const { assignUser } = require('../middleware');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const { getOfferIndexesByContractAndProduct } = require('../offers/offers.Service');
const { getOfferPoolByContractAndProduct } = require('../offerPools/offerPools.Service');

const router = express.Router();

router.get('/', assignUser, getFiles);

router.get(
  '/:token',
  getSpecificContracts,
  getOfferIndexesByContractAndProduct,
  getOfferPoolByContractAndProduct,
  getFilesForToken,
);
module.exports = router;
