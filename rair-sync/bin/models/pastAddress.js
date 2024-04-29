const mongoose = require('mongoose');

const { Schema } = mongoose;

const PastAddress = new Schema({
  address: { type: String, required: true },
  contractType: { type: String, required: true },
  blockchain: { type: String, required: true },
  diamond: { type: Boolean, required: true, default: false },
}, { versionKey: false });

module.exports = PastAddress;
