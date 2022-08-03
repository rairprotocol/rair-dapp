const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  artist: Joi.string(),
  external_url: Joi.string(),
  image: Joi.string(),
  animation_url: Joi.string(),
  attributes: Joi.array().items(
    Joi.object().keys({
      trait_type: Joi.string().required(),
      value: Joi.string().required(),
    }),
  ),
});
