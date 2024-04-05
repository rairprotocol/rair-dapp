const express = require('express');
const { 
    validateChallengeV2,
    validateWeb3AuthOwner,
    generateChallengeV2
} = require('../../integrations/ethers/web3Signature');
const {
    loginFromSignature,
    unlockMediaWithSession,
    logoutWithSession,
    identifyCurrentLoggedUser,
    generateChallengeMessage,
} = require('./auth.Service');
const { validation } = require('../../middleware');

const router = express.Router();

router.post(
    '/get_challenge',
    validation(['getChallengeV2']),
    generateChallengeMessage,
    generateChallengeV2,
    (req, res) => {
        res.send({ success: true, response: req.metaAuth.challenge });
    },
);
router.post(
    '/login/',
    validation(['web3Validation'], 'body'),
    validateChallengeV2,
    loginFromSignature,
);
router.post(
    '/loginSmartAccount',
    validation(['web3Validation'], 'body'),
    validateWeb3AuthOwner,
    loginFromSignature,
);
router.get('/logout/', logoutWithSession);
router.get('/me/', identifyCurrentLoggedUser);
router.get('/stream/out', (req, res) => {
    if (req.session) {
        req.session.authorizedMediaStream = undefined;
        req.session.authorizedMediaType = undefined;
    }
    return res.send({ success: true });
});

router.post(
    '/unlock/',
    validation(['v2Unlock'], 'body'),
    unlockMediaWithSession,
);

module.exports = router;
