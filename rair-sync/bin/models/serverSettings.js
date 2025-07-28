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
  databaseResales: { type: Boolean, default: false },
  // Dark mode colors
  darkModePrimary: { type: String, required: true, default: '#222021' },
  darkModeSecondary: { type: String, required: true, default: '#dedede' },
  darkModeText: { type: String, required: true, default: 'white' },
  // Logo images
  darkModeBannerLogo: { type: String, required: false },
  darkModeMobileLogo: { type: String, required: false },
  // Mobile logo images
  lightModeBannerLogo: { type: String, required: false },
  lightModeMobileLogo: { type: String, required: false },
  // Button
  buttonPrimaryColor: { type: String, required: true, default: '#725bdb' },
  buttonFadeColor: { type: String, required: true, default: '#e882d5' },
  buttonSecondaryColor: { type: String, required: true, default: '#19a7f6' },
  // Icon color
  iconColor: { type: String, required: true, default: '#e882d5' },
  // Custom footer
  footerLinks: {
    type: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
    }],
    required: false,
    default: [],
  },
  legal: { type: String, required: false },
  // Favicon
  favicon: { type: String, required: false },
  signupMessage: { type: String, required: false, default: 'Welcome' },
  customValues: {
    type: [{
      name: { type: String, required: true },
      value: { type: String, required: true },
    }],
    required: false,
    default: [],
  },
}, { versionKey: false, timestamps: false });

module.exports = ServerSetting;
