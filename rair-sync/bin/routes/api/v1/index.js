const express = require('express');
const transactionRoutes = require('./transactions');

const router = express.Router();
router.use('/transaction', transactionRoutes);
module.exports = router;
