const Joi = require('joi');
const config = require('../config');

const supportedNetworks = Object.keys(config.blockchain.networks);

module.exports = {
    ethAddress: Joi.string()
        .pattern(/^0x\w{40}$/)
        .messages({ 'string.pattern.base': 'Invalid Blockchain Address' }),
    mongoId: Joi.string()
        .pattern(/^[a-f\d]{24}$/i)
        .messages({ 'string.pattern.base': 'Invalid Identifier' }),
    blockchainNetworks: Joi.string()
        .valid(...supportedNetworks),
    ethTransaction: Joi.string()
        .pattern(/^0x\w{64}$/)
        .messages({ 'string.pattern.base': 'Invalid Transaction Hash' }),
};
