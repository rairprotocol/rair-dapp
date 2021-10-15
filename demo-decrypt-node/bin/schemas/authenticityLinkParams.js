const Joi = require('joi');

module.exports = Joi.object({
  offerPool: Joi.number()
    .min(1)
    .required(),
  token: Joi.number()
    .min(1)
    .required()
});
