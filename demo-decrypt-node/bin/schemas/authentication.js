const Joi = require('joi');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .min(3)
    .max(50)
    .required(),
  signature: Joi.string()
    .min(3)
    .max(150)
    .required(),
  adminRights: Joi.boolean()
    .required()
});
