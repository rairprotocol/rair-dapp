const Joi = require('joi');

module.exports = Joi.object({
  textParam: Joi.string().required(),
});
