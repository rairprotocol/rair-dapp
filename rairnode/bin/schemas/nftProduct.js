const Joi = require('joi');

module.exports = Joi.object({
  product: Joi.string().required(),
});
