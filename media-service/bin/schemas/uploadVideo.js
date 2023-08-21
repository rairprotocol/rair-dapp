const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().min(1).max(30).required(),
  description: Joi.string().min(1).max(300).required(),
  offers: Joi.array().items(Joi.string()),
  category: Joi.string().min(1).required(),
  demo: Joi.boolean(),
  storage: Joi.any().valid('ipfs', 'gcp'),
});
