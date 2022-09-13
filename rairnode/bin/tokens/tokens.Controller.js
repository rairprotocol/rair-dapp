const express = require('express');
const { createTokensWithCommonMetadata, getSingleToken, updateSingleTokenMetadata, pinMetadataToPinata } = require('./tokens.Service');
const { getContractsByBlockchainAndContractAddress } = require('../contracts/contracts.Service');
const { getOfferIndexesByContractAndProduct } = require('../offers/offers.Service');
const { getOfferPoolByContractAndProduct } = require('../offerPools/offerPools.Service');
const upload = require('../Multer/Config');
const { dataTransform, validation, JWTVerification } = require('../middleware');

module.exports = () => {
  const router = express.Router();

  router.post(
    '/',
    JWTVerification,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('createCommonTokenMetadata'),
    createTokensWithCommonMetadata,
  );

  router.get(
    '/:token',
    getContractsByBlockchainAndContractAddress,
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
  );

  router.patch(
    '/:token',
    JWTVerification,
    getContractsByBlockchainAndContractAddress,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    upload.array('files', 2),
    dataTransform(['attributes']),
    validation('updateTokenMetadata'),
    updateSingleTokenMetadata,
  );

  router.post(
    '/:token',
    JWTVerification,
    getContractsByBlockchainAndContractAddress,
    getOfferIndexesByContractAndProduct,
    getOfferPoolByContractAndProduct,
    pinMetadataToPinata,
  );

  return router;
};
