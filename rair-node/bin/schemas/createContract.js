const Joi = require('joi');
const { ethAddress, blockchainNetworks } = require('./reusableCustomTypes');

module.exports = () => ({
  contractAddress: ethAddress.required(),
  title: Joi.string().required(),
  blockchain: blockchainNetworks.required(),
});
