const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid user address' })
    .required(),
});
