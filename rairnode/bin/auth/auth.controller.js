const express = require('express');
const { authToZoom } = require('./auth.service');

const router = express.Router();

router.post('/zoomjwt', authToZoom);

module.exports = router;
