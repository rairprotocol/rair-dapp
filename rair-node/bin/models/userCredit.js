const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserCredit = new Schema(
  {
    userAddress: { type: String, required: true },
    erc777Address: { type: String, required: true },
    blockchain: { type: String, required: true },
    amountConsumed: { type: Number, required: true, default: 0 },
    amountOnChain: { type: Number, required: true, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

module.exports = UserCredit;
