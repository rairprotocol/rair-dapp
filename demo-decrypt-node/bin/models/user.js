const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  adminNFT: { type: String, required: true },
  email: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = User;
