const Joi = require('joi');
const { ethAddress, blockchainNetworks } = require('./reusableCustomTypes');

module.exports = {
  tokenCreditQuery: () => ({
    blockchain: blockchainNetworks.required(),
    tokenAddress: ethAddress.required(),
  }),
  tokenCreditWithdraw: () => ({
    blockchain: blockchainNetworks.required(),
    tokenAddress: ethAddress.required(),
    amount: Joi.number().unsafe().required(),
  }),
};
