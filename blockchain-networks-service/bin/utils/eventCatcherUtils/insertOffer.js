/* eslint-disable consistent-return */

const {
  handleDuplicateKey,
  findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
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
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  const offer = new dbModels.Offer({
    offerIndex: rangeIndex,
    contract: contract._id,
    product: productIndex,
    offerPool: offerIndex,
    copies: endToken.sub(startToken),
    price,
    range: [startToken.toString(), endToken.toString()],
    offerName: name,
    transactionHash: transactionReceipt.transactionHash
      ? transactionReceipt.transactionHash
      : transactionReceipt.hash,
  })
    .save()
    .catch(handleDuplicateKey);

  return [offer];
};
