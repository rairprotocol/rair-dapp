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
  contract: Joi.string().required(),
  product: Joi.number().required(),
  offer: Joi.array().min(1).items(Joi.number()).required(),
  category: Joi.string().min(1).required()
});
