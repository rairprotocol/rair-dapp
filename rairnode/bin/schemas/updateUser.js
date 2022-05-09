const Joi = require('joi');

module.exports = Joi.object({
  nickName: Joi.string(),
  avatar: Joi.string()
    .uri(),
  email: Joi.string()
    .email(),
});
