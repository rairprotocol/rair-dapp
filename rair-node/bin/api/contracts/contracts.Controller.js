const { Router } = require('express');
const {
  queryMyContracts,
  getAllContracts,
  getContractById,
  updateContract,
  fullListOfContracts,
  importExternalContract,
  searchContractByNetworkAndAddress,
  findContractByNetworkAndAddress,
  productsByNetworkAndAddress,
  offersByNetworkAndAddress,
  contractListForFactory,
} = require('./contracts.Service');
const {
  isAdmin,
  validation,
  verifySuperAdmin,
  requireUserSession,
  loadUserSession,
} = require('../../middleware');

const router = Router();

router.get(
  '/',
  validation(['pagination', 'dbContracts'], 'query'),
  getAllContracts,
);

router.get(
  '/factoryList',
  requireUserSession,
  contractListForFactory,
);

router.get(
  '/my',
  requireUserSession,
  validation(['pagination', 'dbContracts', 'userAddress'], 'query'),
  queryMyContracts,
  getAllContracts,
);
router.get(
  '/full',
  loadUserSession,
  validation(['filterAndSort', 'pagination'], 'query'),
  fullListOfContracts,
);

router.get(
  '/network/:networkId/:contractAddress',
  validation(['singleContract'], 'params'),
  searchContractByNetworkAndAddress,
  findContractByNetworkAndAddress,
);
router.get(
  '/network/:networkId/:contractAddress/products',
  validation(['singleContract'], 'params'),
  searchContractByNetworkAndAddress,
  productsByNetworkAndAddress,
);
router.get(
  '/network/:networkId/:contractAddress/offers',
  validation(['singleContract'], 'params'),
  searchContractByNetworkAndAddress,
  offersByNetworkAndAddress,
);
router.post(
  '/import/',
  requireUserSession,
  isAdmin,
  validation(['importContract'], 'body'),
  importExternalContract,
);

router.get(
  '/:id',
  validation(['dbId'], 'params'),
  getContractById,
);
router.patch(
  '/:id',
  requireUserSession,
  isAdmin,
  verifySuperAdmin,
  validation(['dbId'], 'params'),
  validation(['manageContract']),
  updateContract,
);

module.exports = router;
