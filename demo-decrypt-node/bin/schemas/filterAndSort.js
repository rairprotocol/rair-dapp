const Joi = require('joi');

module.exports = Joi.object({
  pageNum: Joi.number()
    .min(1),
  itemsPerPage: Joi.number()
    .min(5),
  sortBy: Joi.any()
    .valid('creationDate', 'title'),
  sort: Joi.string()
    .pattern(/^1|-1$/)
    .messages({ 'string.pattern.base': "Value should be '1' or '-1'" }),
  blockchain: Joi.string()
    .min(1),
  category: Joi.string()
    .min(1)
});
