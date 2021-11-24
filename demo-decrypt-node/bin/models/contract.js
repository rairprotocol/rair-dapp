const mongoose = require('mongoose');

const { Schema } = mongoose;

const Contract = new Schema({
  title: { type: String, required: true, trim: true },
  user: { type: String, lowercase:true, required: true },
  blockchain: { type: String, required: true },
  contractAddress: { type: String, required: true, lowercase: true, unique: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = Contract;
