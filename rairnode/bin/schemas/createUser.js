const Joi = require('joi');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .pattern(/^0x\w{40}$/)
    .messages({ 'string.pattern.base': 'Invalid publicAddress' })
    .required(),
  // .pattern(/^0x\w{40}:\w+$/)
  // .messages({ 'string.pattern.base': 'Invalid NFT' })
  // .required()
});
