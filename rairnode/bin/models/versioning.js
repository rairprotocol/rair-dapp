const mongoose = require('mongoose');

const { Schema } = mongoose;

const Versioning = new Schema({
  name: { type: String, required: true },
  network: { type: String, required: true },
  number: { type: Number, required: true },
  running: { type: Boolean, required: true, default: false }
}, { versionKey: false });

module.exports = Versioning;
