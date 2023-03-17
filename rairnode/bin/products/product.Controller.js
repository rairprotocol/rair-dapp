const express = require('express');
const productService = require('./product.Service');
const { validation } = require('../middleware');

const router = express.Router();

router.get(
    '/',
    validation('pagination', 'query'),
    validation('dbProducts', 'query'),
    productService.getAllProducts,
);

router.get(
    '/user/:userAddress',
    validation('getProductsByUserAddress', 'params'),
    productService.getProductsByUser,
);

router.get(
    '/:id',
    validation('dbId', 'params'),
    productService.getProductById,
);

module.exports = router;
