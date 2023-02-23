const express = require('express');
const { validateChallengeV2 } = require('../integrations/ethers/web3Signature');
const {
    authToZoom,
    loginFromSignature,
    unlockMediaWithSession,
    logoutWithSession,
    identifyCurrentLoggedUser,
} = require('./auth.service');

const router = express.Router();

router.post('/login/', validateChallengeV2, loginFromSignature);
router.get('/logout/', logoutWithSession);

router.get('/me/', identifyCurrentLoggedUser);

router.post('/zoomjwt', authToZoom);
router.post('/unlock/', unlockMediaWithSession);

module.exports = router;
