const express = require('express');
const { requireUserSession, isAdmin } = require('../../middleware');
const { setMintedTokenResults, createSettingsIfTheyDontExist, setDemoUploads } = require('./settings.Service');

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

module.exports = router;
