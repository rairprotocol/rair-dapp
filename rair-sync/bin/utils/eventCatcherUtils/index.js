const updateDiamondRange = require('./updateDiamondRange');
const updateOfferClassic = require('./updateOfferClassic');
const insertContract = require('./insertContract');
const insertCollection = require('./insertCollection');
const insertTokenClassic = require('./insertTokenClassic');
const insertTokenDiamond = require('./insertTokenDiamond');
const insertOfferPool = require('./insertOfferPool');
const insertOffer = require('./insertOffer');
const insertDiamondOffer = require('./insertDiamondOffer');
const insertDiamondRange = require('./insertDiamondRange');
const metadataForToken = require('./metadataForToken');
const metadataForProduct = require('./metadataForProduct');
const metadataForContract = require('./metadataForContract');
const depositCredits = require('./depositCredits');
const withdrawCredits = require('./witdrawCredits');
const updateMintingOffer = require('./updateMintingOffer');
const sellResaleOffer = require('./sellResaleOffer');
const createResaleOffer = require('./createResaleOffer');
const transferredToken = require('./transferredToken');

module.exports = {
  updateDiamondRange,
  updateOfferClassic,
  insertContract,
  insertCollection,
  insertTokenClassic,
  insertTokenDiamond,
  insertOfferPool,
  insertOffer,
  insertDiamondOffer,
  insertDiamondRange,
  metadataForToken,
  metadataForProduct,
  metadataForContract,
  depositCredits,
  withdrawCredits,
  updateMintingOffer,
  sellResaleOffer,
  createResaleOffer,
  transferredToken,
};
