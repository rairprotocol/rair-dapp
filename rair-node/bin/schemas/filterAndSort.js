const Joi = require('joi');
const { mongoId, ethAddress } = require('./reusableCustomTypes');

module.exports = () => ({
  blockchain: Joi.string(),
  category: Joi.array().items(mongoId),
  userAddress: ethAddress,
  contractAddress: ethAddress,
  hidden: Joi.boolean(),
  mediaTitle: Joi.string(),
  contractTitle: Joi.string(),
});
