const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema({
  title: { type: String, required: true, trim: true },
  user: { type: String, lowercase: true, required: true },
  blockchain: { type: String, required: true },
  contractAddress: { type: String, required: true, lowercase: true },
  diamond: { type: Boolean, required: true, default: false },
  creationDate: { type: Date, default: Date.now },
  transactionHash: { type: String, required: false },
  lastSyncedBlock: { type: String, required: false, default: '0' },
  external: { type: Boolean, required: true, default: false },
  singleMetadata: { type: Boolean, default: false },
  metadataURI: { type: String, default: 'none' },
}, { versionKey: false });

module.exports = Contract;
