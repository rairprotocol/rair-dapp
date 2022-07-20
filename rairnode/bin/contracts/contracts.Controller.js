const express = require('express');
const contractService = require('./contracts.Service');

const router = express.Router();

router.get('/', contractService.getAllContracts);
router.get('/:id', contractService.getContractById);

module.exports = router;
