const mongoose = require('mongoose');

const { Schema } = mongoose;

const Product = new Schema({
  name: { type: String, required: true },
  collectionIndexInContract: { type: Number, required: true },
  contract: { type: String, lowercase: true, required: true },
  copies: { type: Number, required: true },
  soldCopies: { type: Number, default: 0 },
  sold: { type: Boolean, default: false },
  royalty: { type: Number, default: 0 },
  firstTokenIndex: { type: Number, required: true },
  cover: { type: String, default: 'none' },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Product;
