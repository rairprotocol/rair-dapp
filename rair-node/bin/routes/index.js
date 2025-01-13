const { Router } = require('express');

const searchController = require('../api/search/search.Controller');
const analyticsController = require('../api/analytics/analytics.Controller');
const creditController = require('../api/credits/credits.Controller');
const settingsRouter = require('../api/settings/settings.Controller');
const resalesController = require('../api/resales/resales.Controller');
const authController = require('../api/auth/auth.Controller');
const contractsController = require('../api/contracts/contracts.Controller');
const transactionsController = require('../api/transactions/transactions.Controller');
const filesController = require('../api/files/files.Controller');
const usersController = require('../api/users/users.Controller');
const productsController = require('../api/products/product.Controller');
const tokensController = require('../api/tokens/tokens.Controller');
const offersController = require('../api/offers/offers.Controller');
const nftController = require('../api/nft/nft.Controller');
const uploadController = require('../api/upload/upload.Controller');
const favoritesController = require('../api/favorites/favorites.Controller');
const notificationsController = require('../api/notifications/notifications.Controller');
const categoriesController = require('../api/categories/categories.Controller');
const meetingsController = require('../api/meetings/meetings.Controller');

const router = Router();
router.use('/analytics', analyticsController);
router.use('/auth', authController);
router.use('/credits', creditController);
router.use('/contracts', contractsController);
router.use('/files', filesController);
router.use('/favorites', favoritesController);
router.use('/nft', nftController);
router.use('/transaction', transactionsController);
router.use('/users', usersController);
router.use('/offers', offersController);
router.use('/products', productsController);
router.use('/resales', resalesController);
router.use('/search', searchController);
router.use('/settings', settingsRouter);
router.use('/tokens', tokensController);
router.use('/upload', uploadController);
router.use('/notifications', notificationsController);
router.use('/categories', categoriesController);
router.use('/meetings', meetingsController);

// Custom temporary endpoint for the monaco2021
router.use('/', require('./monaco2021'));

module.exports = router;
