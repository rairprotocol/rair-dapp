const { Schema } = require('mongoose');

const File = new Schema(
  {
    // Video Data
    _id: { type: String, required: true },
    uploader: { type: String },
    // Metadata
    title: { type: String, required: true, trim: true },
    description: { type: String },
    duration: { type: String, required: true },
    type: { type: String, required: true },
    extension: { type: String, required: true, select: false },
    // For Zoom integration
    meetingId: { type: String },
    // Encryption data
    encryptionType: { type: String, required: true },
    mainManifest: { type: String, required: true, select: false },
    // Needed for delete functions
    storage: { type: String, required: false },
    storagePath: { type: String, required: false },
    // Thumbnails
    staticThumbnail: { type: String, required: true },
    animatedThumbnail: { type: String, required: false },
    // Extra data
    category: { type: Schema.ObjectId, required: true },
    demo: { type: Boolean, default: false },

    // Analytics
    views: { type: Number, default: 0, required: false },
    totalEncryptedFiles: { type: Number, default: 1, required: false },
  },
  { versionKey: false, timestamps: true },
);

module.exports = File;
