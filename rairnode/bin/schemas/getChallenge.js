const Joi = require('joi');

module.exports = Joi.object({
  MetaAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid MetaAddress' })
    .required(),
});
