const Joi = require('joi');

module.exports = Joi.object({
  adminNFT: Joi.string()
    .pattern(/^0x\w{40}:\w+$/)
    .messages({ 'string.pattern.base': 'Invalid NFT' }),
});
