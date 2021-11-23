const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  _id: { type: String, required: true },
  author: { type: String, required: true },
  currentOwner: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  encryptionType: { type: String, required: true },
  key: { type: Object, required: true },
  mainManifest: { type: String, required: true },
  thumbnail: { type: String, required: true },
  uri: { type: String, required: true },
  contract: { type: String, required: true, lowercase: true },
  product: { type: Number, required: true },
  offer: { type: [Number], required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = File;
