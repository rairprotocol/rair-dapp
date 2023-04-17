const Joi = require('joi');
const { blockchainNetworks } = require('./reusableCustomTypes');

module.exports = () => ({
  searchString: Joi.string()
    .min(1)
    .required(),
  searchBy: Joi.any()
    .valid('users', 'products', 'files'),
  blockchain: blockchainNetworks,
  category: Joi.string()
    .min(1),
});
