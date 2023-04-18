const Joi = require('joi');

module.exports = () => ({
  nickName: Joi.string(),
  avatar: Joi.string(),
  background: Joi.string(),
  email: Joi.string()
    .email(),
});
