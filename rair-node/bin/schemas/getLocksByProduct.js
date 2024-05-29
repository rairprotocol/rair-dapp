const Joi = require('joi');

module.exports = () => ({
  contractId: Joi.string().required(),
  product: Joi.string().required(),
});
