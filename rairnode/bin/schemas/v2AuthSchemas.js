const Joi = require('joi');

module.exports = {
    v2Unlock: () => ({
        type: Joi.string().required(),
        fileId: Joi.string().required(),
    }),
};
