const mongoose = require('mongoose');

const { Schema } = mongoose;

const { DEFAULT_PRODUCT_COVER } = process.env;

const Product = new Schema({
  name: { type: String, required: true, trim: true },
  collectionIndexInContract: { type: Number, required: true },
  contract: { type: String, lowercase: true, required: true },
  copies: { type: Number, required: true },
  soldCopies: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  royalty: { type: Number, default: 0 },
  firstTokenIndex: { type: Number, required: true },
  cover: { type: String, default: DEFAULT_PRODUCT_COVER },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Product;
