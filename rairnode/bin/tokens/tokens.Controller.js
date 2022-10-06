const express = require('express');
const {
  createTokensWithCommonMetadata,
  getSingleToken,
  updateSingleTokenMetadata,
  pinMetadataToPinata,
  createTokensViaCSV,
  getAllTokens,
  getTokenNumbers,
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
  .post(
    JWTVerification,
    isAdmin,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('createCommonTokenMetadata'),
    createTokensWithCommonMetadata,
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
