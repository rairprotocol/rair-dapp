const mongoose = require('mongoose');

const { Schema } = mongoose;

const MediaViewLog = new Schema(
  {
    userAddress: { type: String, required: true },
    file: { type: String, required: true },
    decryptedFiles: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: true },
);

module.exports = MediaViewLog;
