const { OfferPool } = require('../../models');
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
  rangesCreated,
  catalogIndex,
) => {
  const contract = await findContractFromAddress(
    contractAddress,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const offerPool = new OfferPool({
    marketplaceCatalogIndex: catalogIndex,
    contract: contract._id,
    product: productIndex,
    rangeNumber: rangesCreated,
    minterAddress: transactionData.fromAddress,
    transactionHash: transactionData.transactionHash,
  })
    .save()
    .catch(handleDuplicateKey);

  return offerPool;
};
