const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(30)
    .required(),
  blockchain: Joi.string()
    .min(1)
    .max(300),
  contractAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid contract address' })
    .required()
});
