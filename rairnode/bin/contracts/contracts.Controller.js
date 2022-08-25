const express = require('express');
const contractService = require('./contracts.Service');
const { JWTVerification } = require('../middleware');

const router = express.Router();

router.get('/', contractService.getAllContracts);
router.get('/full', contractService.getFullContracts);
router.get('/my', JWTVerification, contractService.getMyContracts);
router.get('/:id', contractService.getContractById);

module.exports = router;
