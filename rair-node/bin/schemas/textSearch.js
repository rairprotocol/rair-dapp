const Joi = require('joi');

module.exports = () => ({
  textParam: Joi.string().required(),
});
