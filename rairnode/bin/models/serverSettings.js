const mongoose = require('mongoose');

const { Schema } = mongoose;

const ServerSetting = new Schema({
  // Queries to minted tokens will only return minted tokens
  onlyMintedTokensResult: { type: Boolean, required: true, default: false },
}, { versionKey: false, timestamps: false });

module.exports = ServerSetting;
