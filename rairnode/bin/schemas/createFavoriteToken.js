const Joi = require('joi');

module.exports = () => ({
  token: Joi.string().required(),
});
