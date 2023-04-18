const Joi = require('joi');
const { mongoId, blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  pageNum: Joi.number().min(1),
  itemsPerPage: Joi.number().min(5),
  blockchain: blockchainNetworks,
  category: Joi.array().items(mongoId),
  userAddress: ethAddress,
  contractAddress: ethAddress,
});
