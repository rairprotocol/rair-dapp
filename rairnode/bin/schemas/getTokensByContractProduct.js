const Joi = require('joi');

module.exports = Joi.object({
  fromToken: Joi.string(),
  toToken: Joi.string(),
  limit: Joi.number(),
});
