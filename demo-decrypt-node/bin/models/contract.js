const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema({
  title: { type: String, required: true },
  blockchain: { type: String, required: true },
  contractAddress: { type: String, required: true, unique: true },
  copies: { type: Number, required: true },
  royalty: { type: Number, required: true },
  user: { type: String, required: true },
  license: { type: Boolean, required: true },
  price: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Contract;
