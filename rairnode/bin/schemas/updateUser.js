const Joi = require('joi');

module.exports = Joi.object({
  adminNFT: Joi.string()
    .pattern(/^0x\w{40}:\w+$/)
    .messages({ 'string.pattern.base': 'Invalid NFT' }),
  nickName: Joi.string(),
  avatar: Joi.string()
    .uri(),
  email: Joi.string()
    .email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
});
