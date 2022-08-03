const Joi = require('joi');

module.exports = Joi.object({
  nickName: Joi.string(),
  avatar: Joi.string(),
  background: Joi.string(),
  email: Joi.string()
    .email(),
});
