const Joi = require('joi');

module.exports = Joi.object({
  contract: Joi.string().required(),
  product: Joi.string().required(),
});
