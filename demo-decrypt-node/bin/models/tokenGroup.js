const mongoose = require('mongoose');

const { Schema } = mongoose;

const TokenGroup = new Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  tokenGroupAddress: { type: String, required: true, unique: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = TokenGroup;
