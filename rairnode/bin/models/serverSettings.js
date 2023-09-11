const mongoose = require('mongoose');

const { Schema } = mongoose;

const ServerSetting = new Schema({
  // Queries to minted tokens will only return minted tokens
  onlyMintedTokensResult: { type: Boolean, required: true, default: false },
  // Enables demo uploads by non-admin users
  demoUploadsEnabled: { type: Boolean, required: true, default: true },
  // Used to generate resale offers
  nodeAddress: { type: String, required: false, default: '' },
}, { versionKey: false, timestamps: false });

module.exports = ServerSetting;
