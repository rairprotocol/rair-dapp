const Joi = require('joi');

module.exports = Joi.object({
  contractId: Joi.string().required(),
  product: Joi.string().required(),
});
