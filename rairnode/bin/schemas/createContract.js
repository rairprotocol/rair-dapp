const Joi = require('joi');
const _ = require('lodash');
const config = require('../config');

module.exports = Joi.object({
  contractAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid Contract address' })
    .required(),
  title: Joi.string()
    .required(),
  blockchain: Joi.any()
    .valid(...(_.keys(config.blockchain.networks)))
    .required(),
});
