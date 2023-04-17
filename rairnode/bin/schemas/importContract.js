const Joi = require('joi');
const { blockchainNetworks } = require('./reusableCustomTypes');

module.exports = () => ({
  networkId: blockchainNetworks.required(),
  contractAddress: Joi.string()
    .required(),
  limit: Joi.number()
    .required(),
  contractCreator: Joi.string()
    .required(),
  socketSessionId: Joi.string(),
});
