const Joi = require('joi');
const  { customValidator } = require('./helpers');

module.exports = Joi.object({
  contractAddress: Joi.custom(customValidator({ min: 3, max: 150 }))
    .required()
});
