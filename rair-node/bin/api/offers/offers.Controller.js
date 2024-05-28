const express = require('express');
const {
  getAllOffers,
} = require('./offers.Service');
const { validation } = require('../../middleware');

const router = express.Router();

router.get(
  '/',
  validation(['pagination', 'dbOffers'], 'query'),
  getAllOffers,
);

module.exports = router;
