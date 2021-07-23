const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  _id: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  encryptionType: { type: String, required: true },
  key: { type: Object, required: true },
  mainManifest: { type: String, required: true },
  thumbnail: { type: String, required: true },
  uri: { type: String, required: true },
  productIndex: { type: Number, required: true },
  offerIndex: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = File;
