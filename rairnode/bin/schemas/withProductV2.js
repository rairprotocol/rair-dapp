const Joi = require('joi');

module.exports = Joi.object({
  product: Joi.any().required(),
}).unknown(true);
