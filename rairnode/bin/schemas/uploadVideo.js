const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().min(1).max(30).required(),
  description: Joi.string().min(1).max(300).required(),
  contract: Joi.string().required(),
  product: Joi.string().required(),
  offer: Joi.array().items(Joi.string()),
  category: Joi.string().min(1).required(),
  demo: Joi.boolean(),
  storage: Joi.any().valid('ipfs', 'gcp'),
});
