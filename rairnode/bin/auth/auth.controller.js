const express = require('express');
const { validateChallengeV2 } = require('../integrations/ethers/web3Signature');
const {
    authToZoom,
    loginFromSignature,
    unlockMediaWithSession,
    logoutWithSession,
    identifyCurrentLoggedUser,
} = require('./auth.service');
const { validation } = require('../middleware');

const router = express.Router();

router.post('/login/', validation('metaValidate', 'body'), validateChallengeV2, loginFromSignature);
router.get('/logout/', logoutWithSession);

router.get('/me/', identifyCurrentLoggedUser);

router.post('/zoomjwt', authToZoom);
router.post(
    '/unlock/',
    validation('v2Unlock', 'body'),
    unlockMediaWithSession,
);

module.exports = router;
