const updateDiamondRange = require('./updateDiamondRange');
const updateOfferClassic = require('./updateOfferClassic');
const insertContract = require('./insertContract');
const insertCollection = require('./insertCollection');
const insertTokenClassic = require('./insertTokenClassic');
const insertTokenDiamond = require('./insertTokenDiamond');
const insertOfferPool = require('./insertOfferPool');
const insertOffer = require('./insertOffer');
const insertDiamondOffer = require('./insertDiamondOffer');
const insertLock = require('./insertLock');
const insertDiamondRange = require('./insertDiamondRange');
const metadataForToken = require('./metadataForToken');
const metadataForProduct = require('./metadataForProduct');
const metadataForContract = require('./metadataForContract');
const handleResaleOffer = require("./handleResaleOffer");
const registerCustomSplits = require("./insertCustomResaleSplits");
const updateResaleOffer = require("./updateResaleOffer");

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
  insertLock,
  insertDiamondRange,
  metadataForToken,
  metadataForProduct,
  metadataForContract,
  handleResaleOffer,
  registerCustomSplits,
  updateResaleOffer
};
