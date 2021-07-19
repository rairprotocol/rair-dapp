const mongoose = require('mongoose');

const { Schema } = mongoose;

const SoldItem = new Schema({
  product: { type: String, required: true },
  price: { type: Number },
  owner: { type: String, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = SoldItem;
