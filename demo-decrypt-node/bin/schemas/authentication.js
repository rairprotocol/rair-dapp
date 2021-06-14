const Joi = require('joi');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .min(1)
    .max(50)
    .required(),
  signature: Joi.string()
    .min(1)
    .max(150)
    .required(),
  adminRights: Joi.boolean()
    .required()
});
