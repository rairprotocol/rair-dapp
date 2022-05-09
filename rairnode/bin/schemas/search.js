const Joi = require('joi');

module.exports = Joi.object({
  searchString: Joi.string()
    .min(1)
    .required(),
  searchBy: Joi.any()
    .valid('users', 'products', 'files'),
  blockchain: Joi.string()
    .pattern(/^0x\w*/)
    .messages({ 'string.pattern.base': 'Invalid blockchain hash' }),
  category: Joi.string()
    .min(1),
});
