const { Schema } = require('mongoose');

const Blockchain = new Schema({
  hash: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  display: { type: Boolean, required: false, default: true },
  sync: { type: Boolean, required: false, default: true },

  diamondFactoryAddress: { type: String, required: false },
  classicFactoryAddress: { type: String, required: false },
  diamondMarketplaceAddress: { type: String, required: false },
  mainTokenAddress: { type: String, required: false },
  licenseExchangeAddress: { type: String, required: false },

  rpcEndpoint: { type: String, required: false },
  blockExplorerGateway: { type: String, required: false },
  alchemySupport: { type: Boolean, required: true, default: false },

  numericalId: { type: Number, required: false },
  testnet: { type: Boolean, required: false },
  symbol: { type: String, required: false },
}, { versionKey: false });

module.exports = Blockchain;
