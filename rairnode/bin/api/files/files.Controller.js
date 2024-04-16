const express = require('express');
const {
    getFile,
    getFilesForToken,
    getFilesByCategory,
    connectFileAndOffer,
    getFileAndOffer,
    removeFileAndOffer,
    updateFile,
    isFileOwner,
    listCategories,
    updateMedia,
    deleteMedia,
    listMedia,
} = require('./files.Service');
const {
    validation,
    requireUserSession,
    isOwner,
    loadUserSession,
} = require('../../middleware');
const { File } = require('../../models');

const router = express.Router();

router.patch(
    '/update/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    validation(['updateMedia'], 'body'),
    isOwner(File),
    updateMedia,
);

router.delete(
    '/remove/:mediaId',
    requireUserSession,
    validation(['removeMedia'], 'params'),
    isOwner(File),
    deleteMedia,
);

router.get(
    '/list',
    validation(['dbFiles', 'filterAndSort', 'pagination'], 'query'),
    loadUserSession,
    listMedia,
);

router.get(
    '/byId/:id',
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
router.get('/categories', listCategories);
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
