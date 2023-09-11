const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResaleTokenOffer = new Schema({
  tokenContract: { type: mongoose.Schema.ObjectId, ref: 'Contract', required: true },
  tokenIndex: { type: String, required: true },
  price: { type: String, required: true },
  buyer: { type: String, default: undefined },
  seller: { type: String, required: true },
});
module.exports = ResaleTokenOffer;
