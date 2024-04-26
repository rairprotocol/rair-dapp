const Joi = require('joi');
const { mongoId } = require('./reusableCustomTypes');

module.exports = () => ({
  contractId: mongoId.required(),
  product: Joi.number(),
  overwritePin: Joi.string(),
});
