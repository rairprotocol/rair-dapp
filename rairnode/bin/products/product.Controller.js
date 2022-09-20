const express = require('express');
const productService = require('./product.Service');

const router = express.Router();
router.get('/', productService.getAllProducts);
router.get('/user/:userAddress', productService.getProductsByUser);
router.get('/:productId', productService.getProductById);
module.exports = router;
