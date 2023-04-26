const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserCreditMovement = new Schema(
  {
    userAddress: { type: String, required: true },
    erc777Address: { type: String, required: true },
    blockchain: { type: String, required: true },
    balanceChange: { type: Number, required: true, default: 0 },
  },
  { versionKey: false, timestamps: true },
);

module.exports = UserCreditMovement;
