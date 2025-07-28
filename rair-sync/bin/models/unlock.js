const mongoose = require('mongoose');

const { Schema } = mongoose;

const Unlock = new Schema({
  file: { type: String, ref: 'File', required: true },
  offers: [{ type: Schema.ObjectId, ref: 'Offer', required: true }],
}, { versionKey: false, timestamps: false });

module.exports = Unlock;
