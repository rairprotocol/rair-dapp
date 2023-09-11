const express = require('express');
const { requireUserSession, isAdmin } = require('../../middleware');
const {
  setMintedTokenResults,
  createSettingsIfTheyDontExist,
  setDemoUploads,
  setNodeAddress,
} = require('./settings.Service');

const router = express.Router();

router.post(
  '/mintedTokenResults',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  setMintedTokenResults,
);

router.post(
  '/demoUploadsEnabled',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  setDemoUploads,
);

router.post(
  '/nodeAddress',
  requireUserSession,
  isAdmin,
  createSettingsIfTheyDontExist,
  setNodeAddress,
);

module.exports = router;
