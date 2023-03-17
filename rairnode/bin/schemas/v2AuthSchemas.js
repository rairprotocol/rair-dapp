const Joi = require('joi');

module.exports = {
    v2Unlock: Joi.object({
        type: Joi.string().required(),
        fileId: Joi.string().required(),
    }),
};
