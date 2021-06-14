const Joi = require('joi');

module.exports = Joi.object({
  publicAddress: Joi.string()
    .min(1)
    .max(50)
    .required(),
  adminNFT: Joi.string()
    .min(1)
    .max(150)
    .required()
});
