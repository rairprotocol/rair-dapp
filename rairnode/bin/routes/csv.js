const express = require('express');
const path = require('path');

const router = express.Router();

// Handlers
const getSample = async (req, res, next) => {
  try {
    const file = path.join(__dirname, '../../assets/sample.csv');

    return res.download(file);
  } catch (e) {
    return next(e);
  }
};

// Routes
router.get('/sample', getSample);

module.exports = router;
