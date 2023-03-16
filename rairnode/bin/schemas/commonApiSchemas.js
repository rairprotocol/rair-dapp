const Joi = require('joi');
const { ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    pagination: Joi.object({
        pageNum: Joi.number(),
        itemsPerPage: Joi.number(),
    }),
    dbId: Joi.object({
        id: mongoId,
    }),
    productId: Joi.object({
        productId: mongoId,
    }),
    offerId: Joi.object({
        offerId: mongoId,
    }),
    userId: Joi.object({
        userId: mongoId,
    }),
    userAddress: Joi.object({
        userAddress: ethAddress,
    }),
};
