const express = require('express');
const {
    createFavorite,
    getAllFavoritesByUser,
    getAllFavoritesOfAddress,
    deleteFavorite,
} = require('./favorites.Service');
const { validation, isOwner, requireUserSession } = require('../../middleware');
const { FavoriteTokens } = require('../../models');

const router = express.Router();
router.post('/', requireUserSession, validation(['createFavoriteToken']), createFavorite);
router.get('/', requireUserSession, validation(['pagination'], 'query'), getAllFavoritesByUser);
router.get(
    '/:userAddress',
    validation(['pagination', 'userAddress'], 'query'),
    getAllFavoritesOfAddress,
);
router.delete('/:id', requireUserSession, validation(['dbId'], 'params'), isOwner(FavoriteTokens), deleteFavorite);

module.exports = router;
