const mongoose = require('mongoose');

const { Schema } = mongoose;

const ServerSetting = new Schema({
  // Queries to minted tokens will only return minted tokens
  onlyMintedTokensResult: { type: Boolean, required: true, default: false },
  // Enables demo uploads by non-admin users
  demoUploadsEnabled: { type: Boolean, required: true, default: true },
  // Featured collection (to display on the frontend)
  featuredCollection: { type: Schema.ObjectId, ref: 'Product', default: undefined },
  // Used to generate resale offers
  nodeAddress: { type: String, required: false, default: '' },
  // User addresses with super admin rights
  superAdmins: [{ type: String, required: false }],
  superAdminsOnVault: { type: Boolean, default: false },
  // Light mode and dark mode colors for background
  darkModePrimary: { type: String, required: false },
  darkModeSecondary: { type: String, required: false },
  darkModeText: { type: String, required: false },
  // Logo images
  darkModeBannerLogo: { type: String, required: false },
  darkModeMobileLogo: { type: String, required: false },
  // Mobile logo images
  lightModeBannerLogo: { type: String, required: false },
  lightModeMobileLogo: { type: String, required: false },
  // Button
  buttonPrimaryColor: { type: String, required: false },
  buttonFadeColor: { type: String, required: false },
  buttonSecondaryColor: { type: String, required: false },
}, { versionKey: false, timestamps: false });

module.exports = ServerSetting;
