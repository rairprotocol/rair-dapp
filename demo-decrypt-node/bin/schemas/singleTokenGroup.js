const Joi = require('joi');
const  { customValidator } = require('./helpers');

module.exports = Joi.object({
  tokenGroupAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid TokenGroup address' })
    .required()
});
