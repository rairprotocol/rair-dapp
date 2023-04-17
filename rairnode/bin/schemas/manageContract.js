const Joi = require('joi');

module.exports = () => ({
  blockSync: Joi.boolean(),
  blockView: Joi.boolean(),
});
