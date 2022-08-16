const Joi = require('joi');

module.exports = Joi.object({
  token: Joi.string().required(),
});
