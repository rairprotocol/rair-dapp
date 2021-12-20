const mongoose = require('mongoose');

const { Schema } = mongoose;

const Blockchain = new Schema({
  hash: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true }
}, { versionKey: false });

module.exports = Blockchain;
