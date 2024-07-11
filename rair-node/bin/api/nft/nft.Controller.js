const { Router } = require('express');
const { validation, isAdmin, requireUserSession, loadUserSession, dataTransform } = require('../../middleware');
const upload = require('../../Multer/Config');
const { createTokensViaCSV } = require('../tokens/tokens.Service');
const {
    getUserTokens,
    getUserTokensProfile,
    metadataCSVSample,
    pinMetadataToIPFS,
    findContractMiddleware,
    findProductMiddleware,
    getProductAttributes,
    getTokensForProduct,
    filesForTokenInProduct,
    getFilesForProduct,
    findOffersForProductMiddleware,
    getSingleToken,
    updateTokenMetadata,
    getOffersForProduct,
    getLockedOffersForProduct,
    pinSingleTokenMetadata,
} = require('./nft.Service');

const router = Router();
router.post(
    '/',
    requireUserSession,
    isAdmin,
    upload.single('csv'),
    validation(['csvFileUpload'], 'body'),
    createTokensViaCSV,
);
router.get(
    '/',
    requireUserSession,
    getUserTokens,
);
router.get(
    '/:userAddress',
    validation(['pagination', 'resaleFlag'], 'query'),
    validation(['userAddress'], 'params'),
    getUserTokensProfile,
);
router.get(
    '/csv/sample',
    metadataCSVSample,
);

router.post(
    '/pinningMultiple',
    requireUserSession,
    validation(['pinningMultiple']),
    pinMetadataToIPFS,
);
router.get(
    '/network/:networkId/:contract/:product',
    validation(['nftContract', 'nftProduct'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    validation(['getTokensByContractProduct', 'resaleFlag', 'metadataSearch'], 'query'),
    getTokensForProduct,
);
router.get(
    '/network/:networkId/:contract/:product/attributes',
    validation(['nftContract', 'nftProduct'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    getProductAttributes,
);
router.get(
    '/network/:networkId/:contract/:product/files/',
    validation(['nftContract', 'nftProduct'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    loadUserSession,
    getFilesForProduct,
);
router.get(
    '/network/:networkId/:contract/:product/files/:token',
    validation(['nftContract', 'nftProduct', 'tokenNumber'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    filesForTokenInProduct,
);
router.get(
    '/network/:networkId/:contract/:product/offers',
    validation(['nftContract', 'nftProduct'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    getOffersForProduct,
);
router.get(
    '/network/:networkId/:contract/:product/locks',
    validation(['nftContract', 'nftProduct'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    getLockedOffersForProduct,
);
router.get(
    '/network/:networkId/:contract/:product/token/:token',
    validation(['nftContract', 'nftProduct', 'tokenNumber'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    findOffersForProductMiddleware,
    getSingleToken,
);
router.post(
    '/network/:networkId/:contract/:product/token/:token',
    validation(['nftContract', 'nftProduct', 'tokenNumber'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    findOffersForProductMiddleware,
    requireUserSession,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation(['updateTokenMetadata']),
    updateTokenMetadata,
);
router.post(
    '/network/:networkId/:contract/:product/token/:token/pinning',
    validation(['nftContract', 'nftProduct', 'tokenNumber'], 'params'),
    findContractMiddleware,
    findProductMiddleware,
    findOffersForProductMiddleware,
    requireUserSession,
    pinSingleTokenMetadata,
);

module.exports = router;
