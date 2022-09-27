const Joi = require('joi');

module.exports = Joi.object({
  blockSync: Joi.boolean(),
  blockView: Joi.boolean(),
});
