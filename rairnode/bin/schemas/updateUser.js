const Joi = require('joi');

module.exports = () => ({
  nickName: Joi.string(),
  avatar: Joi.string(),
  background: Joi.string(),
  email: Joi.string().email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  ageVerified: Joi.boolean(),
  blocked: Joi.boolean(),
});
