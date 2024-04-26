const Joi = require('joi');
const { ethAddress, blockchainNetworks, mongoId } = require('./reusableCustomTypes');

module.exports = {
  resaleQuery: () => ({
    contract: ethAddress,
    blockchain: blockchainNetworks,
    index: Joi.number(),
  }),
  resaleUpdate: () => ({
    id: mongoId,
    price: Joi.number().unsafe(),
  }),
  resaleCreate: () => ({
    contract: ethAddress,
    blockchain: blockchainNetworks,
    index: Joi.number(),
    price: Joi.number().unsafe(),
  }),
};
