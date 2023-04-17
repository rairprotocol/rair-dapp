const Joi = require('joi');

module.exports = () => ({
  product: Joi.any().required(),
});
