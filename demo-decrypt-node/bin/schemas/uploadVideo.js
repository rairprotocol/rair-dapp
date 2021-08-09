const Joi = require('joi');
const { number } = require('joi');

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(30)
    .required(),
  description: Joi.string()
    .min(1)
    .max(300)
    .required(),
  contract: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid contract address' })
    .required(),
  product: Joi.number().required(),
  offer: Joi.array().items(Joi.number()).required()
});
