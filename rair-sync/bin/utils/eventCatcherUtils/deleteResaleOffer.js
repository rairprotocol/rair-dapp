const { ResaleTokenOffer, Contract } = require('../../models');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  offerId,
) => {
  const contracts = await Contract.find({ blockchain: transactionData.network }, { _id: 1 });
  const foundOffer = await ResaleTokenOffer.findOneAndDelete({
    blockchainOfferId: offerId,
    buyer: undefined,
    tokenContract: { $in: contracts.map((item) => item._id) },
  });

  return foundOffer;
};
