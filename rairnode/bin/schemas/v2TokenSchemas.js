const Joi = require('joi');
const { mongoId } = require('./reusableCustomTypes');

module.exports = {
    csvFileUpload: Joi.object({
        contract: mongoId,
        product: Joi.string(),
        updateMeta: Joi.boolean(),
    }),
    getTokenNumbers: Joi.object({
        contract: mongoId,
        offerPool: Joi.string(),
        offers: Joi.string(),
    }),
    tokenNumber: Joi.object({
        token: Joi.string(),
    }),
};
