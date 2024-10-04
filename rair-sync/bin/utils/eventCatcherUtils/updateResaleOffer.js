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
  newPrice,
) => {
  const contracts = await Contract.find({ blockchain: transactionData.network }, { _id: 1 });
  const foundOffer = await ResaleTokenOffer.findOneAndUpdate({
    blockchainOfferId: offerId,
    buyer: undefined,
    tokenContract: { $in: contracts.map((item) => item._id) },
  }, {
    $set: {
      price: newPrice,
    },
  });

  return foundOffer;
};
