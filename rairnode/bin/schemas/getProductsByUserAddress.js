const Joi = require('joi');

module.exports = Joi.object({
  userAddress: Joi.string()
  .pattern(/^0x\w{40}$/)
  .messages({ 'string.pattern.base': 'Invalid User Address' })
  .required(),
});
