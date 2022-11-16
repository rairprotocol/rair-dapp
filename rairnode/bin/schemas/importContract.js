const Joi = require('joi');
const config = require('../config');

module.exports = Joi.object({
  networkId: Joi.any()
    .valid(...(Object.keys(config.blockchain.networks)))
    .required(),
  contractAddress: Joi.string()
    .required(),
  limit: Joi.number()
    .required(),
  contractCreator: Joi.string()
    .required(),
});
