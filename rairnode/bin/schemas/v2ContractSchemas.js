const Joi = require('joi');
const { blockchainNetworks, ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    fullContracts: Joi.object({
        pageNum: Joi.number(),
        itemsPerPage: Joi.number(),
        blockchain: blockchainNetworks,
        contractAddress: ethAddress,
        contractId: mongoId,
        addOffers: Joi.boolean(),
        addLocks: Joi.boolean(),
    }),
    importExternalContracts: Joi.object({
        networkId: blockchainNetworks,
        contractAddress: ethAddress,
        limit: Joi.number(),
    }),
    specificContracts: Joi.object({
        contractAddress: ethAddress,
        networkId: blockchainNetworks,
        contract: mongoId,
    }),
};
