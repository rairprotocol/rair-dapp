const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
  // Video Data
  _id: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  // Encryption data
  encryptionType: { type: String, required: true },
  key: { type: Object, required: true },
  mainManifest: { type: String, required: true },
  // Thumbnails
  staticThumbnail: { type: String, required: true },
  animatedThumbnail: { type: String, required: false },
  uri: { type: String, required: true },
  // Blockchain data
  contract: { type: String, required: true, lowercase: true },
  product: { type: Number, required: true },
  offer: { type: [Number], required: true },
  // Extra data
  duration: { type: String, required: true },
  // Format data
  type: { type: String, required: true },
  extension: { type: String, required: true },
  category: { type: Schema.ObjectId, required: true },

  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = File;
