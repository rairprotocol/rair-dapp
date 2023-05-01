const express = require('express');
const {
  getSingleToken,
  updateSingleTokenMetadata,
  pinMetadataToPinata,
  createTokensViaCSV,
  getAllTokens,
  getTokenNumbers,
  updateTokenCommonMetadata,
  getFullTokenInfo,
} = require('./tokens.Service');
const { getSpecificContracts } = require('../../contracts/contracts.Service');
const {
  getOfferIndexesByContractAndProduct,
} = require('../../offers/offers.Service');
const {
  getOfferPoolByContractAndProduct,
} = require('../../offerPools/offerPools.Service');
const upload = require('../../Multer/Config');
const {
  dataTransform,
  validation,
  isAdmin,
  requireUserSession,
} = require('../../middleware');

const router = express.Router();

router
  .route('/')
  .get(
    validation(['specificContracts', 'pagination', 'dbTokens'], 'query'),
    getSpecificContracts,
    getAllTokens,
  )
  .patch(
    requireUserSession,
    isAdmin,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation(['updateCommonTokenMetadata']),
    updateTokenCommonMetadata,
  );

router.get(
  '/:id',
  validation(['dbId'], 'params'),
  getFullTokenInfo,
);

router.post(
  '/viaCSV',
  requireUserSession,
  isAdmin,
  upload.single('csv'),
  validation(['csvFileUpload'], 'body'),
  createTokensViaCSV,
);
router.get(
  '/my',
  requireUserSession,
  (req, res, next) => {
    req.query.ownerAddress = req.user.publicAddress;
    next();
  },
  validation(['dbTokens', 'pagination'], 'query'),
  getAllTokens,
);
router.use(
  validation(['withProductV2', 'specificContracts'], 'query'),
  getSpecificContracts,
  getOfferIndexesByContractAndProduct,
  getOfferPoolByContractAndProduct,
);

router.get(
  '/tokenNumbers',
  requireUserSession,
  validation(['getTokenNumbers'], 'query'),
  getTokenNumbers,
);

router
  .route('/:token', validation(['tokenNumber'], 'params'))
  .get(
    validation(['getTokenNumbers'], 'query'),
    (req, res, next) => {
      const { contract, offers, offerPool } = req.query;

      req.specificFilterOptions = contract.diamond
        ? { offer: { $in: offers } }
        : { offerPool: offerPool.marketplaceCatalogIndex };

      return next();
    },
    getSingleToken,
  )
  .patch(
    requireUserSession,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation(['updateTokenMetadata']),
    updateSingleTokenMetadata,
  )
  .post(
    requireUserSession,
    validation(['getTokenNumbers'], 'query'),
    pinMetadataToPinata,
  );

module.exports = router;
