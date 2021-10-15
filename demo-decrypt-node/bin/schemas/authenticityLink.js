const Joi = require('joi');

module.exports = Joi.object({
  link: Joi.string().required()
});
