const mongoose = require('mongoose');

const { Schema } = mongoose;

const Transaction = new Schema({
  _id: { type: String, required: true },
  caught: { type: Boolean, default: false },
  blockchainId: { type: String, required: true },
  toAddress: [{ type: String, required: true }],
  processed: { type: Boolean, default: false },
}, { versionKey: false, timestamps: true, _id: false });

module.exports = Transaction;
