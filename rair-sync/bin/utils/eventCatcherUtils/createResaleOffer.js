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
  seller,
  token,
  tokenPrice,
  offerId,
) => {
  const contract = await findContractFromAddress(
    erc721Address,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const foundOffer = new ResaleTokenOffer({
    tokenContract: contract._id,
    tokenIndex: token.toString(),
    seller: seller.toLowerCase(),
    price: tokenPrice.toString(),
    blockchainOfferId: offerId,
    buyer: undefined,
  });
  await foundOffer.save();

  return foundOffer;
};
