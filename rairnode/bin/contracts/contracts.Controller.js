const express = require('express');
const contractService = require('./contracts.Service');
const {
  verifyUserSession,
  isAdmin,
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
router.get(
  '/my',
  verifyUserSession,
  contractService.queryMyContracts,
  contractService.getAllContracts,
);
router.post(
  '/import',
  verifyUserSession,
  isAdmin,
  contractService.importContractsMoralis,
);
// Overload is implemented on service level
router.get(
  '/fullSA',
  verifyUserSession,
  isAdmin,
  verifySuperAdmin,
  contractService.getFullContracts,
);
router.get('/:id', contractService.getContractById);

// Allows to update only two fields
router.patch(
  '/:id',
  verifyUserSession,
  isAdmin,
  verifySuperAdmin,
  validation('manageContract'),
  contractService.updateContract,
);

module.exports = router;
