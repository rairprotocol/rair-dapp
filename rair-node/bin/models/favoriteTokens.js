const mongoose = require('mongoose');

const { Schema } = mongoose;

const FavoriteTokens = new Schema(
  {
    userAddress: { type: String, required: true },
    token: { type: Schema.ObjectId, ref: 'MintedToken', required: true },
  },
  { versionKey: false },
);

module.exports = FavoriteTokens;
