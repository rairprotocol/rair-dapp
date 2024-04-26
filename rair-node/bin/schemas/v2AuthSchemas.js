const Joi = require('joi');
const { customValidator } = require('./helpers');
const { blockchainNetworks, ethAddress } = require('./reusableCustomTypes');

module.exports = {
    v2Unlock: () => ({
        type: Joi.string().required(),
        fileId: Joi.string().required(),
    }),
    web3Validation: () => ({
        MetaMessage: Joi.custom(customValidator({ min: 3, max: 70 }))
            .required(),
        MetaSignature: Joi.custom(customValidator({ min: 132, max: 770 }))
            .required(),
        ownerAddress: ethAddress,
        userAddress: ethAddress,
        mediaId: Joi.string(),
        zoomId: Joi.string(),
    }),
};
