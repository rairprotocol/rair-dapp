const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string()
    .min(1)
    .max(30)
    .required(),
  blockchain: Joi.string()
    .min(1)
    .max(300)
    .required(),
  contractAddress: Joi.string()
    .min(3)
    .max(150)
    .required(),
  copies: Joi.number()
    .required(),
  royalty: Joi.number()
    .required(),
  license: Joi.boolean()
    .required(),
  price: Joi.number()
    .required()
});
