const Joi = require('joi');

module.exports = Joi.object({
  adminNFT: Joi.string()
    .min(3)
    .max(150)
});
