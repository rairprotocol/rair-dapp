const Joi = require('joi');
const { mongoId } = require('./reusableCustomTypes');

module.exports = {
    csvFileUpload: () => ({
        contract: mongoId,
        product: Joi.string(),
        forceOverwrite: Joi.boolean(),
    }),
    getTokenNumbers: () => ({
        contract: mongoId,
        product: Joi.string(),
        offerPool: Joi.string(),
        offers: Joi.string(),
    }),
    tokenNumber: () => ({
        token: Joi.string(),
    }),
};
