const Joi = require('joi');

module.exports = () => ({
  title: Joi.string()
    .min(1)
    .max(30),
});
