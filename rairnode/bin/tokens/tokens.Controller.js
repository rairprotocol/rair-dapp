const express = require('express');
const {
  getSingleToken,
  updateSingleTokenMetadata,
  pinMetadataToPinata,
  createTokensViaCSV,
  getAllTokens,
  getTokenNumbers,
  updateTokenCommonMetadata,
} = require('./tokens.Service');
const { getSpecificContracts } = require('../contracts/contracts.Service');
const {
  getOfferIndexesByContractAndProduct,
} = require('../offers/offers.Service');
const {
  getOfferPoolByContractAndProduct,
} = require('../offerPools/offerPools.Service');
const upload = require('../Multer/Config');
const {
  dataTransform,
  validation,
  JWTVerification,
  isAdmin,
} = require('../middleware');

const router = express.Router();

router
  .route('/')
  .get(getSpecificContracts, getAllTokens)
  .patch(
    JWTVerification,
    isAdmin,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('updateCommonTokenMetadata'),
    updateTokenCommonMetadata,
  );
router.post(
  '/viaCSV',
  JWTVerification,
  isAdmin,
  upload.single('csv'),
  createTokensViaCSV,
);
router.get(
  '/my',
  JWTVerification,
  (req, res, next) => {
    req.query.ownerAddress = req.user.publicAddress;
    next();
  },
  getAllTokens,
);
router.use(
  validation('withProductV2', 'query'),
  getSpecificContracts,
  getOfferIndexesByContractAndProduct,
  getOfferPoolByContractAndProduct,
);
router.get('/tokenNumbers', JWTVerification, getTokenNumbers);
router
  .route('/:token')
  .get((req, res, next) => {
    const { contract, offers, offerPool } = req;

    req.specificFilterOptions = contract.diamond
      ? { offer: { $in: offers } }
      : { offerPool: offerPool.marketplaceCatalogIndex };

    return next();
  }, getSingleToken)
  .patch(
    JWTVerification,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('updateTokenMetadata'),
    updateSingleTokenMetadata,
  )
  .post(
    JWTVerification,

    pinMetadataToPinata,
  );

module.exports = router;
