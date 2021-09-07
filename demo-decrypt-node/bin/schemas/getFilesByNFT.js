const Joi = require('joi');

module.exports = Joi.object({
  contract: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid Contract address' })
    .required(),
  token: Joi.string().required(),
  product: Joi.number().required()
});
