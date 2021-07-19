const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema({
  title: { type: String, required: true },
  blockchain: { type: String },
  contractAddress: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Contract;
