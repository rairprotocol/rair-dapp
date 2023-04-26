const Joi = require('joi');
const { customValidator } = require('./helpers');
const { ethAddress } = require('./reusableCustomTypes');

module.exports = {
  analyticsParams: () => ({
    mediaId: Joi.custom(customValidator({ min: 3, max: 50 }))
      .required(),
  }),
  analyticsQuery: () => ({
    fromDate: Joi.date(),
    toDate: Joi.date(),
    userAddress: ethAddress,
    onlyCount: Joi.boolean(),
  }),
};
