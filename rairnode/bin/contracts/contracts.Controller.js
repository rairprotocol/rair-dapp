const express = require('express');
const contractService = require('./contracts.Service');
const {
  JWTVerification,
  isAdmin,
  isSuperAdmin,
  validation,
  verifySuperAdmin,
} = require('../middleware');
const userService = require('../users/users.Service');

const router = express.Router();

router.get('/', contractService.getAllContracts);
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
// Overload is implemented on service level
router.get(
  '/fullSA',
  JWTVerification,
  isAdmin,
  isSuperAdmin,
  verifySuperAdmin,
  contractService.getFullContracts,
);
router.get('/:id', contractService.getContractById);

// Allows to update only two fields
router.patch(
  '/:id',
  JWTVerification,
  isAdmin,
  isSuperAdmin,
  verifySuperAdmin,
  validation('manageContract'),
  contractService.updateContract,
);

module.exports = router;
