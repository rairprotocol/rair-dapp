const mongoose = require('mongoose');

const { Schema } = mongoose;

const OfferPool = new Schema({
  marketplaceCatalogIndex: { type: Number, required: true },
  contract: { type: Schema.ObjectId, required: true },
  product: { type: Number },
  rangeNumber: { type: Number },
  minterAddress: { type: String },
  creationDate: { type: Date, default: Date.now },
  transactionHash: { type: String, required: false },
}, { versionKey: false });

module.exports = OfferPool;
