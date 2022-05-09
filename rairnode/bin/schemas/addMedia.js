const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = Joi.object({
  mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
    .required(),
});
