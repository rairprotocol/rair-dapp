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
    updateMedia,
    deleteMedia,
    listMedia,
    updateMediaThumbnails,
} = require('./files.Service');
const {
    validation,
    requireUserSession,
    isOwner,
    loadUserSession,
} = require('../../middleware');
const { File } = require('../../models');
const upload = require('../../Multer/Config');

const router = express.Router();

router.patch(
    '/update/:id',
    requireUserSession,
    validation(['fileId'], 'params'),
    validation(['updateMedia'], 'body'),
    isOwner(File),
    updateMedia,
);

router.put(
    '/thumbnails/:id',
    requireUserSession,
    validation(['fileId'], 'params'),
    isOwner(File),
    upload.fields([{
        name: 'staticThumbnail', maxCount: 1,
    }, {
        name: 'animatedThumbnail', maxCount: 1,
    }]),
    updateMediaThumbnails,
);

router.delete(
    '/remove/:id',
    requireUserSession,
    validation(['fileId'], 'params'),
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
router.get(
    '/:id/unlocks',
    validation(['fileId'], 'params'),
    getFileAndOffer,
);
router.post(
    '/:id/unlocks',
    validation(['fileId'], 'params'),
    validation(['offerArray'], 'body'),
    requireUserSession,
    isFileOwner,
    connectFileAndOffer,
);
router.delete(
    '/:id/unlocks',
    validation(['fileId'], 'params'),
    validation(['singleOffer'], 'body'),
    requireUserSession,
    isFileOwner,
    removeFileAndOffer,
);

module.exports = router;
