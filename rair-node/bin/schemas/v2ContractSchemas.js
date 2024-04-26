const Joi = require('joi');
const { blockchainNetworks, ethAddress, mongoId } = require('./reusableCustomTypes');

module.exports = {
    fullContracts: () => ({
        pageNum: Joi.number(),
        itemsPerPage: Joi.number(),
        blockchain: blockchainNetworks,
        contractAddress: ethAddress,
        contractId: mongoId,
        addOffers: Joi.boolean(),
        addLocks: Joi.boolean(),
    }),
    importExternalContracts: () => ({
        networkId: blockchainNetworks,
        contractAddress: ethAddress,
        limit: Joi.number(),
    }),
};
