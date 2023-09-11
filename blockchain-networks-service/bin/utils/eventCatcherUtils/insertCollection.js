const { Product } = require('../../models');
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
  collectionIndex,
  collectionName,
  startingToken,
  collectionLength,
) => {
  const contract = await findContractFromAddress(
    transactionData.fromAddress,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const product = new Product({
    name: collectionName,
    collectionIndexInContract: collectionIndex,
    contract: contract._id,
    copies: collectionLength,
    firstTokenIndex: startingToken,
    transactionHash: transactionData.transactionHash,
    diamond: transactionData.diamondEvent,
  })
    .save()
    .catch(handleDuplicateKey);

  return product;
};
