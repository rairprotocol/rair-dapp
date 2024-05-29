const { findContractFromAddress } = require('./eventsCommonUtils');
const { ResaleTokenOffer } = require('../../models');
const { redisClient } = require('../../services/redis');

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

  redisClient.set('notification', JSON.stringify({
    type: 'resalePurchase',
    message: `Your token #${token} was purchased!`,
    address: seller.toLowerCase(),
    additionalInfo: [foundOffer._id],
  }));

  return foundOffer;
};
