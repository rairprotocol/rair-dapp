const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const { Schema } = mongoose;

const User = new Schema({
  email: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  publicAddress: { type: String, lowercase:true, required: true, unique: true },
  adminNFT: { type: String, lowercase:true, required: true, unique: true },
  nonce: { type: String, default: () => nanoid() },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = User;
