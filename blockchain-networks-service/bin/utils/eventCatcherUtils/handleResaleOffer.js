const {
    findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
    dbModels,
    chainId,
    transactionReceipt,
    diamondEvent,
    operator,
    tokenAddress,
    tokenId,
    price,
    status,
    tradeid,
    ) => {
    const contract = await findContractFromAddress(
        tokenAddress,
        chainId,
        transactionReceipt,
        dbModels,
    );

    if (!contract) {
        return;
    }

    const token = await dbModels.MintedToken.findOne({
        contract: contract._id,
        uniqueIndexInContract: tokenId,
    });

    if (!token) {
        return;
    }

    let offer = await dbModels.ResaleTokenOffer.findOne({
        contract: contract._id,
        tokenId,
        tradeid,
        status: 0,
    });

    if (offer) {
        switch (status.toString()) {
        case '1':
            console.log('OFFER CLOSED');
            break;
        case '2':
            console.log('OFFER CANCELLED');
            break;
        default:
            console.log('Unsupported status', status);
            return undefined;
        }
        offer.status = status;
    } else {
        offer = await new dbModels.ResaleTokenOffer({
        operator,
        contract: contract._id,
        tokenId,
        price,
        status,
        tradeid,
        });
    }
    await offer.save();
    return offer;
};