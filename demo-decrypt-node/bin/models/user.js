const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const { Schema } = mongoose;

const User = new Schema({
  adminNFT: { type: String, required: true, unique: true },
  email: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  publicAddress: { type: String, required: true, unique: true },
  nonce: { type: String, default: () => nanoid() },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = User;
