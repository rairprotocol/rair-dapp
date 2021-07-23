const mongoose = require('mongoose');

const { Schema } = mongoose;

const Offer = new Schema({
  marketplaceCatalogIndex: { type: Number, required: true },
  contract: { type: String, required: true },
  product: { type: Number, required: true },
  copies: { type: Number, required: true },
  soldCopies: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  price: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = Offer;
