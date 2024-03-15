const express = require('express');
const { requireUserSession, isAdmin, verifySuperAdmin } = require('../../middleware');
const upload = require('../../Multer/Config');
const {
  createSettingsIfTheyDontExist,
  getServerSettings,
  setServerSetting,
  getFeaturedCollection,
  setBlockchainSetting,
  setAppLogo,
  getTheme
} = require('./settings.Service');

const router = express.Router();

router.get(
  '/',
  requireUserSession,
  isAdmin,
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
  '/:setting',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  setServerSetting,
);

router.put(
  '/:blockchain',
  requireUserSession,
  verifySuperAdmin,
  setBlockchainSetting,
);

module.exports = router;
