const express = require('express');
const productService = require('./product.Service');
const { validation } = require('../../middleware');
const upload = require('../../Multer/Config');

const router = express.Router();

router.get(
    '/',
    validation(['dbProducts', 'pagination'], 'query'),
    productService.getAllProducts,
);

router.get(
    '/user/:userAddress',
    validation(['userAddress'], 'params'),
    productService.getProductsByUser,
);

router.get(
    '/:id',
    validation(['dbId'], 'params'),
    productService.getProductById,
);

router.post(
    '/:id',
    upload.single('banner'),
    validation(['dbId'], 'params'),
    productService.setProductBanner,
);

module.exports = router;
