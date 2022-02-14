const Joi = require('joi');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid publicAddress' })
    .required(),
  signature: Joi.string()
    .min(3)
    .max(150)
    .required(),
  adminRights: Joi.boolean()
    .required()
});
