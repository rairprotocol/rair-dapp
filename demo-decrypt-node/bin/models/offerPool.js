const mongoose = require('mongoose');

const { Schema } = mongoose;

const OfferPool = new Schema({
  marketplaceCatalogIndex: { type: Number, unique: true, required: true },
  contract: { type: String, lowercase:true, required: true },
  product: { type: Number },
  rangeNumber: { type: Number },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = OfferPool;
