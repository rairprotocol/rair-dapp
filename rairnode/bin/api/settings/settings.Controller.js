const express = require('express');
const { requireUserSession } = require('../../middleware');
const { setMintedTokenResults, createSettingsIfTheyDontExist } = require('./settings.Service');

const router = express.Router();

router.post(
  '/mintedTokenResults',
  requireUserSession,
  createSettingsIfTheyDontExist,
  setMintedTokenResults,
);

module.exports = router;
