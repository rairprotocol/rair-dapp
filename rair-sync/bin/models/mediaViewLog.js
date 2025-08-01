const mongoose = require('mongoose');

const { Schema } = mongoose;

const MediaViewLog = new Schema(
  {
    userAddress: { type: String, required: true },
    file: { type: String, ref: 'File', required: true },
    decryptedFiles: { type: Number, default: 0 },
    offer: { type: Schema.ObjectId, ref: 'Offer', required: false },
  },
  { versionKey: false, timestamps: true },
);

module.exports = MediaViewLog;
