const Joi = require('joi');

module.exports = () => ({
  product: Joi.string().required(),
});
