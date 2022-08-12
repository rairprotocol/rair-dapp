const {
    findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
    dbModels,
    chainId,
    transactionReceipt,
    diamondEvent,
    offerId,
    contractAddress,
    oldPrice,
    newPrice,
    ) => {

    const contract = await findContractFromAddress(
        contractAddress,
        chainId,
        transactionReceipt,
        dbModels
    )

    const foundOffer = await dbModels.ResaleTokenOffer.findOne({
        tradeid: offerId,
        contract: contract._id
    })

    if (foundOffer) {
        foundOffer.price = newPrice;
        await foundOffer.save();
    } else {
        log.error(
            `[${chainId}] Error updating resale offer, couldn't find offer ${offerId} with old price ${oldPrice}`,
        );
    }

}