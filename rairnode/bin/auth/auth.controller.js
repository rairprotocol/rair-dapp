const express = require('express');
const { validateChallengeV2 } = require('../integrations/ethers/web3Signature');
const {
    authToZoom,
    loginFromSignature,
    unlockMediaWithSession,
    logoutWithSession,
    identifyCurrentLoggedUser,
    oreIdIdentifier,
} = require('./auth.service');
const { validation } = require('../middleware');

const router = express.Router();

router.post(
    '/login/',
    validation(['web3Validation'], 'body'),
    validateChallengeV2,
    loginFromSignature,
);
router.post(
    '/oreId/',
    validation(['oreIdValidation'], 'body'),
    oreIdIdentifier,
    loginFromSignature,
);
router.get('/logout/', logoutWithSession);

router.get('/me/', identifyCurrentLoggedUser);

router.post('/zoomjwt', authToZoom);
router.post(
    '/unlock/',
    validation(['v2Unlock'], 'body'),
    unlockMediaWithSession,
);

module.exports = router;
