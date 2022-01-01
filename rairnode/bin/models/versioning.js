const mongoose = require('mongoose');

const { Schema } = mongoose;

const Versioning = new Schema({
  name: { type: String, required: true },
  network: { type: String, required: true },
  number: { type: Number, required: true }
}, { versionKey: false });

module.exports = Versioning;
