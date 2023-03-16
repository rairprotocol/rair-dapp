const express = require('express');
const { getFile, getFiles, getFilesForToken } = require('./files.Service');
const { validation, loadUserSession } = require('../middleware');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const { getOfferIndexesByContractAndProduct } = require('../offers/offers.Service');
const { getOfferPoolByContractAndProduct } = require('../offerPools/offerPools.Service');

const router = express.Router();

router.get(
    '/',
    loadUserSession,
    validation('getFilesByProduct', 'query'),
    getFiles,
);
router.get(
    '/byID/:id',
    validation('dbId', 'params'),
    getFile,
);
router.get(
    '/:token',
    validation('filesForTokenId', 'params'),
    getSpecificContracts,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    getFilesForToken,
);
module.exports = router;
