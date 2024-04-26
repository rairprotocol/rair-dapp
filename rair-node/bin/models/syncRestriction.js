const mongoose = require('mongoose');

const { Schema } = mongoose;

const SyncRestriction = new Schema({
  blockchain: { type: String, required: true },
  contractAddress: { type: String, required: true, lowercase: true },
  contract: { type: Boolean, required: true },
  products: { type: Boolean, required: true },
  offerPools: { type: Boolean, required: true },
  offers: { type: Boolean, required: true },
  tokens: { type: Boolean, required: true },
  locks: { type: Boolean, required: true },
}, { versionKey: false });

module.exports = SyncRestriction;
