const Joi = require('joi');

module.exports = Joi.object({
  link: Joi.string().required(),
  tokens: Joi.array().items(Joi.number()).required(),
  description: Joi.string()
});
