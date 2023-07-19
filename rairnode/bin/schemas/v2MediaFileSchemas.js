const Joi = require('joi');
const { ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    validateMediaData: () => ({
        contract: mongoId,
        product: Joi.string(),
        offer: Joi.array().items(Joi.string()).max(2),
        category: Joi.string(),
        demo: Joi.boolean(),
    }),
    addFileFromMediaService: () => ({
        cid: Joi.string(),
        meta: Joi.object({
            mainManifest: Joi.string().required(),
            uploader: ethAddress.required(),
            encryptionType: Joi.string().required(),
            title: Joi.string(),
            contract: mongoId.required(),
            product: Joi.string().required(),
            offer: Joi.array().items(Joi.string()).max(2),
            category: mongoId.required(),
            staticThumbnail: Joi.string(),
            animatedThumbnail: Joi.string(),
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
