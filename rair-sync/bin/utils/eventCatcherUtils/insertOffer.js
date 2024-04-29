const { Offer } = require('../../models');
const {
  handleDuplicateKey,
  findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  contractAddress,
  productIndex,
  offerIndex,
  rangeIndex,
  startToken,
  endToken,
  price,
  name,
) => {
  const contract = await findContractFromAddress(
    contractAddress,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const offer = new Offer({
    offerIndex: rangeIndex,
    contract: contract._id,
    product: productIndex,
    offerPool: offerIndex,
    copies: endToken.sub(startToken),
    price,
    range: [startToken.toString(), endToken.toString()],
    offerName: name,
    transactionHash: transactionData.transactionHash,
  })
    .save()
    .catch(handleDuplicateKey);

  return offer;
};
