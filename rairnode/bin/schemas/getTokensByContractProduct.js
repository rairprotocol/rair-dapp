const Joi = require('joi');

module.exports = Joi.object({
  fromToken: Joi.number(),
  toToken: Joi.number(),
  limit: Joi.number(),
});
