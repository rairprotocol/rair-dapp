const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().min(1).max(30),
  description: Joi.string().min(1).max(300),
  contract: Joi.string(),
  product: Joi.string(),
  offer: Joi.array().items(Joi.string()),
  category: Joi.string().min(1),
  demo: Joi.boolean(),
});
