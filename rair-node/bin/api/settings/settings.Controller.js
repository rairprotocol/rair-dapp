const express = require('express');
const { requireUserSession, isAdmin, verifySuperAdmin, validation } = require('../../middleware');
const upload = require('../../Multer/Config');
const {
  createSettingsIfTheyDontExist,
  getServerSettings,
  setServerSetting,
  getFeaturedCollection,
  setBlockchainSetting,
  setAppLogo,
  getTheme,
} = require('./settings.Service');

const router = express.Router();

router.get(
  '/',
  createSettingsIfTheyDontExist,
  getServerSettings,
);

router.get(
  '/theme',
  createSettingsIfTheyDontExist,
  getTheme,
);

router.get(
  '/featured',
  getFeaturedCollection,
);

router.post(
  '/appLogo',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  upload.single('logoImage'),
  setAppLogo,
);

router.post(
  '/',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  validation(['dbSettings']),
  setServerSetting,
);

router.put(
  '/:blockchain',
  requireUserSession,
  validation(['dbBlockchains']),
  verifySuperAdmin,
  setBlockchainSetting,
);

module.exports = router;
