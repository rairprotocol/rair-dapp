const { Schema } = require('mongoose');

const Blockchain = new Schema({
  hash: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  display: { type: Boolean, required: false, default: true },
  sync: { type: Boolean, required: false, default: true },
}, { versionKey: false });

module.exports = Blockchain;
