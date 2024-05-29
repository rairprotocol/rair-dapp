const Joi = require('joi');

module.exports = () => ({
  contract: Joi.string().required(),
  token: Joi.string().required(),
  product: Joi.string().required(),
});
