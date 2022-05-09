const Joi = require('joi');
const _ = require('lodash');
const config = require('../config');

const supportedNetworks = _.keys(config.blockchain.networks);

module.exports = Joi.object({
  networkId: Joi.any()
    .valid(...supportedNetworks)
    .required(),
  contract: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid Contract address' })
    .required(),
});
