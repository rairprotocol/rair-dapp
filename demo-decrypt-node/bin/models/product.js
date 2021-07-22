const mongoose = require('mongoose');

const { Schema } = mongoose;

const Product = new Schema({
  name: { type: String, required: true },
  productAddress: { type: String, required: true },
  blockchain: { type: String, required: true },
  contract: { type: String, required: true },
  copies: { type: Number, required: true },
  resale: { type: Number, required: true },
  price: { type: Number },
  specialPrice: { type: Number },
  royalty: { type: Number },
  creationDate: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = Product;
