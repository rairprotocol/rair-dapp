const { findContractFromAddress } = require('./eventsCommonUtils');
const { ResaleTokenOffer } = require('../../models');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  erc721Address,
  buyer,
  seller,
  token,
  tokenPrice,
) => {
  const contract = await findContractFromAddress(
    erc721Address,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const foundOffer = await ResaleTokenOffer.findOneAndUpdate({
    tokenContract: contract._id,
    tokenIndex: token.toString(),
    seller: seller.toLowerCase(),
    price: tokenPrice.toString(),
    buyer: undefined,
  }, {
    buyer: buyer.toString().toLowerCase(),
  });

  return foundOffer;
};
