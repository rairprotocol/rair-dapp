const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = Joi.object({
  MetaMessage: Joi.custom(customValidator({ min: 3, max: 70 }))
    .required(),
  MetaSignature: Joi.custom(customValidator({ min: 3, max: 150 }))
    .required(),
  mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
    .required(),
});
