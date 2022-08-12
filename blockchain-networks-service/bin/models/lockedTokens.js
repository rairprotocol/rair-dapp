const mongoose = require('mongoose');

const { Schema } = mongoose;

const LockedTokens = new Schema(
  {
    lockIndex: { type: String, required: true },
    contract: { type: Schema.ObjectId, required: true },
    product: { type: String, required: true },
    range: { type: [String], required: true },
    lockedTokens: { type: String, required: true },
    isLocked: { type: Boolean, required: true },
  },
  { versionKey: false }
);

module.exports = LockedTokens;
