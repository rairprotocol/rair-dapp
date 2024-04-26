const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = () => ({
  mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
    .required(),
});
