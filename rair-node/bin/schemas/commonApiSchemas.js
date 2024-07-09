const Joi = require('joi');
const { ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    pagination: () => ({
        pageNum: Joi.number(),
        itemsPerPage: [Joi.number(), Joi.string().valid('all')],
    }),
    dbId: () => ({
        id: mongoId,
    }),
    dbIdArray: () => ({
        ids: Joi.array().items(mongoId),
    }),
    fileId: () => ({
        id: Joi.string().required(),
    }),
    productId: () => ({
        productId: mongoId,
    }),
    userAddress: () => ({
        userAddress: ethAddress,
    }),
    resaleFlag: () => ({
        onResale: Joi.boolean(),
    }),
    metadataSearch: () => ({
        metadataFilters: Joi.string(),
    }),
};
