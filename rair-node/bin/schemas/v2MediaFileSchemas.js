const Joi = require('joi');
const { ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    validateMediaData: () => ({
        offers: Joi.array().items(mongoId),
        category: mongoId.required(),
        demo: Joi.boolean(),
        demoEndpoint: Joi.boolean(),
        publicAddress: ethAddress,
    }),
    addFileFromMediaService: () => ({
        cid: Joi.string(),
        meta: Joi.object({
            mainManifest: Joi.string().required(),
            uploader: ethAddress.required(),
            encryptionType: Joi.string().required(),
            title: Joi.string(),
            offers: Joi.array().items(mongoId),
            category: mongoId.required(),
            staticThumbnail: Joi.string(),
            animatedThumbnail: Joi.string().allow(''),
            type: Joi.string().required(),
            extension: Joi.string().required(),
            duration: Joi.string().required(),
            demo: Joi.boolean(),
            totalEncryptedFiles: Joi.number(),
            storage: Joi.string().required(),
            storagePath: Joi.string().required(),
            description: Joi.string(),
        }),
    }),
};
