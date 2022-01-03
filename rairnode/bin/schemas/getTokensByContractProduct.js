const Joi = require('joi');

module.exports = Joi.object({
  fromToken: Joi.number(),
  limit: Joi.number()
});
