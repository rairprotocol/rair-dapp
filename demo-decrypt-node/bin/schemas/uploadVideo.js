const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(30)
    .required(),
  description: Joi.string()
    .min(1)
    .max(300)
    .required(),
  token: Joi.string()
    .min(3)
    .max(150)
    .required(),
  category: Joi.string()
    .required(),
  price: Joi.number()
    .required(),
  copies: Joi.number()
    .required(),
  mint: Joi.string()
    .min(3)
    .max(150)
    .required(),
  royalty: Joi.number()
    .required()
});
