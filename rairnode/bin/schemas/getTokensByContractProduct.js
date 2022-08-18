const Joi = require('joi');

module.exports = Joi.object({
  fromToken: Joi.string(),
  toToken: Joi.string(),
  limit: Joi.number(),
  forSale: Joi.any()
    .valid('true', 'false'),
  priceFrom: Joi.number(),
  priceTo: Joi.number(),
  filterConditions: Joi.string(),
  sortByPrice: Joi.any()
    .valid('1', '-1'),
  sortByToken: Joi.any()
    .valid('1', '-1'),
});
