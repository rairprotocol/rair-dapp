const Joi = require('joi');
const { customValidator } = require('./helpers');

module.exports = {
    v2Unlock: () => ({
        type: Joi.string().required(),
        fileId: Joi.string().required(),
    }),
    web3Validation: () => ({
        MetaMessage: Joi.custom(customValidator({ min: 3, max: 70 }))
            .required(),
        MetaSignature: Joi.custom(customValidator({ min: 3, max: 150 }))
            .required(),
        mediaId: Joi.string(),
        zoomId: Joi.string(),
    }),
    oreIdValidation: () => ({
        idToken: Joi.string().required(),
    }),
};
