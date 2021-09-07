const mongoose = require('mongoose');

const { Schema } = mongoose;

const MintedToken = new Schema({
  token: { type: String, required: true },
  ownerAddress: { type: String, lowercase: true, required: true },
  offerPool: { type: Number, required: true },
  offer: { type: Number, required: true },
  contract: { type: String, lowercase: true, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = MintedToken;
