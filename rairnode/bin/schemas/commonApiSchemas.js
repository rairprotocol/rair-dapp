const Joi = require('joi');
const { ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    pagination: () => ({
        pageNum: Joi.number(),
        itemsPerPage: Joi.number(),
    }),
    dbId: () => ({
        id: mongoId,
    }),
    productId: () => ({
        productId: mongoId,
    }),
    offerId: () => ({
        offerId: mongoId,
    }),
    userId: () => ({
        userId: mongoId,
    }),
    userAddress: () => ({
        userAddress: ethAddress,
    }),
};
