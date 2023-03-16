const Joi = require('joi');
const { customValidator } = require('./helpers');
const { ethAddress } = require('./reusableCustomTypes');

module.exports = {
  analyticsParams: Joi.object({
    mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
      .required(),
  }),
  analyticsQuery: Joi.object({
    fromDate: Joi.date(),
    toDate: Joi.date(),
    userAddress: ethAddress,
    onlyCount: Joi.boolean(),
    itemsPerPage: Joi.number(),
    pageNum: Joi.number(),
  }),
};
