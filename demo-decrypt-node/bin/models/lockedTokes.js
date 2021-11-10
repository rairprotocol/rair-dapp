const mongoose = require('mongoose');

const { Schema } = mongoose;

const LockedTokens = new Schema({
  lockIndex: { type: Number, required: true },
  contract: { type: String, required: true },
  product: { type: Number, required: true },
  range: { type: [Number], required: true },
  lockedTokens: { type: Number, required: true },
  isLocked: { type: Boolean, required: true }
}, { versionKey: false });

module.exports = LockedTokens;
