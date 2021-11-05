const mongoose = require('mongoose');

const { Schema } = mongoose;

const Metadata = new Schema({
  name: { type: String, required: true, default: 'none' },
  description: { type: String, required: true, default: 'none' },
  artist: { type: String, default: 'none' },
  external_url: { type: String, default: 'none' },
  image: { type: String },
  animation_url: { type: String },
  attributes: { type: [{
      trait_type: String,
      value: String
    }] }
}, { _id: false });

const MintedToken = new Schema({
  token: { type: Number, required: true },
  uniqueIndexInContract: { type: Number, required: true },
  ownerAddress: { type: String, lowercase: true },
  offerPool: { type: Number, required: true },
  offer: { type: Number, required: true },
  contract: { type: String, lowercase: true, required: true },
  metadata: { type: Metadata, default: () => ({}) },
  metadataURI: { type: String, default: 'none' },
  authenticityLink: { type: String, default: 'none' },
  isMinted: { type: Boolean, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = MintedToken;
