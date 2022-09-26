const express = require('express');
const {
  createTokensWithCommonMetadata,
  getSingleToken,
  updateSingleTokenMetadata,
  pinMetadataToPinata,
  getAllTokens,
} = require('./tokens.Service');
const {
  getSpecificContracts,
} = require('../contracts/contracts.Service');
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

router.post(
  '/',
  JWTVerification,
  isAdmin,
  upload.array('files', 2),
  dataTransform(['attributes']),
  validation('createCommonTokenMetadata'),
  createTokensWithCommonMetadata,
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
router
  .route('/:token')
  .get(
    getSpecificContracts,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    (req, res, next) => {
      const { contract, offers, offerPool } = req;

      req.specificFilterOptions = contract.diamond
        ? { offer: { $in: offers } }
        : { offerPool: offerPool.marketplaceCatalogIndex };

      return next();
    },
    getSingleToken,
  )
  .patch(
    JWTVerification,
    getSpecificContracts,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('updateTokenMetadata'),
    updateSingleTokenMetadata,
  )
  .post(
    JWTVerification,
    getSpecificContracts,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    pinMetadataToPinata,
  );

module.exports = router;
