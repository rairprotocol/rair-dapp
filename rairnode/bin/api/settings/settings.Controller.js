const express = require('express');
const { requireUserSession, isAdmin } = require('../../middleware');
const {
  createSettingsIfTheyDontExist,
  getServerSettings,
  setServerSetting,
  getFeaturedCollection,
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

module.exports = router;
