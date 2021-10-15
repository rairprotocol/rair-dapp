const mongoose = require('mongoose');

const { Schema } = mongoose;

const AuthenticityLink = new Schema({
  link: { type: String, required: true },
  description: { type: String },
  token: { type: Number, required: true },
  offerPool: { type: Number, required: true },
  contract: { type: String, lowercase: true, required: true },
  creationDate: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = AuthenticityLink;
