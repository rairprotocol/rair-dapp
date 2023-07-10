const express = require('express');
const {
    getFile,
    getFiles,
    getFilesForToken,
    getFilesByCategory,
    connectFileAndOffer,
    getFileAndOffer,
    removeFileAndOffer,
    updateFile,
} = require('./files.Service');
const { validation, requireUserSession } = require('../../middleware');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const { getOfferIndexesByContractAndProduct } = require('../offers/offers.Service');
const { getOfferPoolByContractAndProduct } = require('../../offerPools/offerPools.Service');

const router = express.Router();

router.get(
    '/',
    requireUserSession,
    validation(['dbFiles'], 'query'),
    getFiles,
);
router.get(
    '/byID/:id',
    getFile,
);
router.put(
    '/byId/:id',
    validation(['dbFiles'], 'body'),
    updateFile,
);
router.get(
    '/byCategory/:id',
    validation(['dbId'], 'params'),
    validation(['pagination'], 'query'),
    getFilesByCategory,
);
router.get(
    '/:token',
    validation(['filesForTokenId'], 'params'),
    getSpecificContracts,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    getFilesForToken,
);

router.get('/:id/unlocks', getFileAndOffer);
router.post('/:id/unlocks', connectFileAndOffer);
router.delete('/:id/unlocks', removeFileAndOffer);

module.exports = router;
