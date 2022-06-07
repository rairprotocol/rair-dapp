const express = require('express');
const contractService = require('./contracts.Service');

module.exports = (dbInjection) => {
  const router = express.Router();
  // TODO: MB:
  // router.get(
  //   '/',
  //   contractService.getAllContracts(dbInjection.db.Contract),
  // ); -> getMyContracts
  // +getFullContracts

  // replacing old route '/singleContract/:contractId'
  router.get(
    '/:contractId',
    contractService.getContractById(dbInjection.db.Contract),
  );

  return router;
};
