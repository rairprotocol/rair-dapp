const { FavoriteTokens } = require('../models');
const eFactory = require('../utils/entityFactory');

exports.createFavorite = eFactory.createOne(FavoriteTokens, { userAddress: 'user.publicAddress' });
exports.getAllFavoritesByUser = eFactory.getAll(FavoriteTokens, { filter: { userAddress: 'user.publicAddress' }, populateOptions: 'token' });
exports.deleteFavorite = eFactory.deleteOne(FavoriteTokens);
