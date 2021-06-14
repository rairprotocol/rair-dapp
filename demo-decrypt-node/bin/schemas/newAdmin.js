const Joi = require('joi');

module.exports = Joi.object({
  adminNFT: Joi.string()
    .min(1)
    .max(150)
});
