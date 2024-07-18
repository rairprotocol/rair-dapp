const Joi = require('joi');

module.exports = {
    ethAddress: Joi.string()
        .pattern(/^0x\w{40}$/)
        .messages({ 'string.pattern.base': 'Invalid ETH Address' }),
    mongoId: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .messages({ 'string.pattern.base': 'Invalid Identifier' }),
    blockchainNetworks: Joi.string()
        .pattern(/^0x\w{64}$/),
    ethTransaction: Joi.string()
        .pattern(/^0x\w{64}$/)
        .messages({ 'string.pattern.base': 'Invalid Transaction Hash' }),
};
