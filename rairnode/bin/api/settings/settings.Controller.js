const express = require('express');
const { requireUserSession, isAdmin, verifySuperAdmin } = require('../../middleware');
const {
  createSettingsIfTheyDontExist,
  getServerSettings,
  setServerSetting,
  getFeaturedCollection,
  setBlockchainSetting,
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
  '/featured',
  getFeaturedCollection,
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
