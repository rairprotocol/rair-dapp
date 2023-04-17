const Joi = require('joi');
const { ethAddress, blockchainNetworks } = require('./reusableCustomTypes');

module.exports = {
  tokenCreditQuery: Joi.object({
    blockchain: blockchainNetworks.required(),
    tokenAddress: ethAddress.required(),
  }),
  tokenCreditWithdraw: Joi.object({
    blockchain: blockchainNetworks.required(),
    tokenAddress: ethAddress.required(),
    amount: Joi.number().unsafe().required(),
  }),
};
