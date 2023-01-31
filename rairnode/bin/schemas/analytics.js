const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = {
  analyticsParams: Joi.object({
    mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
      .required(),
  }),
  analyticsQuery: Joi.object({
    fromDate: Joi.date(),
    toDate: Joi.date(),
    userAddress: Joi.string()
      .pattern(/^0x\w{40}$/)
      .messages({ 'string.pattern.base': 'Invalid publicAddress' }),
    onlyCount: Joi.boolean(),
    itemsPerPage: Joi.number(),
    pageNum: Joi.number(),
  }),
};
