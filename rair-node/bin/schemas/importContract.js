const Joi = require('joi');
const { blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  networkId: blockchainNetworks.required(),
  contractAddress: ethAddress.required(),
  limit: Joi.number().required(),
  contractCreator: ethAddress.required(),
  socketSessionId: Joi.string(),
});
