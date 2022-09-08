const express = require('express');
const contractService = require('./contracts.Service');
const { JWTVerification, isAdmin } = require('../middleware');
const userService = require('../users/users.Service');

const router = express.Router();

router.get('/', contractService.getAllContracts);
router.get(
  '/byUser/:userId',
  userService.addUserAdressToFilterById,
  contractService.getAllContracts,
);
router.get(
  '/byUser/:userId',
  userService.addUserAdressToFilterById,
  contractService.getAllContracts,
);
router.get('/full', contractService.getFullContracts);
router.get('/my', JWTVerification, contractService.getMyContracts);
router.post(
  '/import',
  JWTVerification,
  isAdmin,
  contractService.importContractsMoralis,
);
router.get('/:id', contractService.getContractById);

module.exports = router;
