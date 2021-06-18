const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  _id: { type: String, required: true },
  key: { type: Object, required: true },
  mainManifest: { type: String, required: true },
  nftIdentifier: { type: String, required: true },
  encryption: { type: String, required: true },
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  uri: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = File;
