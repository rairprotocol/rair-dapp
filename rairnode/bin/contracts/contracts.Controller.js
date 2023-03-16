const express = require('express');
const contractService = require('./contracts.Service');
const {
  isAdmin,
  validation,
  verifySuperAdmin,
  requireUserSession,
} = require('../middleware');
const userService = require('../users/users.Service');

const router = express.Router();

router.get(
  '/',
  validation('pagination', 'query'),
  validation('dbContracts', 'query'),
  contractService.getAllContracts,
);
router.get(
  '/byUser/:userId',
  validation('dbContracts', 'query'),
  validation('userId', 'params'),
  userService.addUserAdressToFilterById,
  contractService.getAllContracts,
);
router.get(
  '/full',
  validation('fullContracts', 'query'),
  contractService.getFullContracts,
);

router.get(
  '/byCategory/:id',
  validation('dbId', 'params'),
  validation('pagination', 'query'),
  contractService.getContractByCategory,
);

router.get(
  '/my',
  requireUserSession,
  validation('pagination', 'query'),
  validation('dbContracts', 'query'),
  validation('userAddress', 'query'),
  contractService.queryMyContracts,
  contractService.getAllContracts,
);
router.post(
  '/import',
  requireUserSession,
  isAdmin,
  validation('importExternalContract', 'body'),
  contractService.importContractsMoralis,
);
// Overload is implemented on service level
router.get(
  '/fullSA',
  requireUserSession,
  isAdmin,
  verifySuperAdmin,
  validation('fullContracts', 'query'),
  contractService.getFullContracts,
);
router.get(
  '/:id',
  validation('dbId', 'params'),
  contractService.getContractById,
);

// Allows to update only two fields
router.patch(
  '/:id',
  requireUserSession,
  isAdmin,
  verifySuperAdmin,
  validation('dbId', 'params'),
  validation('manageContract'),
  contractService.updateContract,
);

module.exports = router;
