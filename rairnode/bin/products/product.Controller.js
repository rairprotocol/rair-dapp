const express = require('express');
const productService = require('./product.Service');
const { validation } = require("../middleware");

const router = express.Router();
router.get('/', productService.getAllProducts);
router.get('/user/:userAddress', validation('getProductsByUserAddress', 'params'), productService.getProductsByUser);
router.get('/:productId', productService.getProductById);
module.exports = router;
