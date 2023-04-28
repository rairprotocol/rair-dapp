const Joi = require('joi');
const { mongoId, blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  blockchain: blockchainNetworks,
  category: Joi.array().items(mongoId),
  userAddress: ethAddress,
  contractAddress: ethAddress,
  hidden: Joi.boolean(),
});
