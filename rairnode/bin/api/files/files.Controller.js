const express = require('express');
const {
    getFile,
    getFiles,
    getFilesForToken,
    getFilesByCategory,
    connectFileAndOffer,
    getFileAndOffer,
    removeFileAndOffer,
    updateFile,
    isFileOwner,
} = require('./files.Service');
const { validation, requireUserSession } = require('../../middleware');

const router = express.Router();

router.get(
    '/',
    requireUserSession,
    validation(['dbFiles'], 'query'),
    getFiles,
);
router.get(
    '/byID/:id',
    validation(['fileId'], 'params'),
    getFile,
);
router.put(
    '/byId/:id',
    requireUserSession,
    validation(['fileId'], 'params'),
    validation(['dbFiles'], 'body'),
    isFileOwner,
    updateFile,
);
router.get(
    '/byCategory/:id',
    validation(['fileId'], 'params'),
    validation(['pagination'], 'query'),
    getFilesByCategory,
);
router.get(
    '/forToken/:id',
    validation(['dbId'], 'params'),
    getFilesForToken,
);

router.get('/:id/unlocks', getFileAndOffer);
router.post(
    '/:id/unlocks',
    requireUserSession,
    isFileOwner,
    connectFileAndOffer,
);
router.delete(
    '/:id/unlocks',
    requireUserSession,
    isFileOwner,
    removeFileAndOffer,
);

module.exports = router;
