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
  collectionIndex,
  collectionName,
  startingToken,
  collectionLength,
) => {
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  const product = new dbModels.Product({
    name: collectionName,
    collectionIndexInContract: collectionIndex,
    contract: contract._id,
    copies: collectionLength,
    firstTokenIndex: startingToken,
    transactionHash: transactionReceipt.transactionHash
      ? transactionReceipt.transactionHash
      : transactionReceipt.hash,
    diamond: diamondEvent,
  })
    .save()
    .catch(handleDuplicateKey);

  return [product];
};
