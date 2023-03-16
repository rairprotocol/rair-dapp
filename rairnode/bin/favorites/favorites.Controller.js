const express = require('express');
const { createFavorite, getAllFavoritesByUser, deleteFavorite } = require('./favoriteTokens.Service');
const { validation, isOwner } = require('../middleware');
const { FavoriteTokens } = require('../models');

const router = express.Router();

router.post('/', validation('createFavoriteToken'), createFavorite);
router.get('/', validation('pagination', 'query'), getAllFavoritesByUser);
router.delete('/:id', validation('dbId', 'params'), isOwner(FavoriteTokens), deleteFavorite);

module.exports = router;
