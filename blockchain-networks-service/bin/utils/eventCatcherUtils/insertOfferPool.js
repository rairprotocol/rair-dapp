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
  rangesCreated,
  catalogIndex,
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

  const offerPool = new dbModels.OfferPool({
    marketplaceCatalogIndex: catalogIndex,
    contract: contract._id,
    product: productIndex,
    rangeNumber: rangesCreated,
    minterAddress: transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    transactionHash: transactionReceipt.transactionHash
      ? transactionReceipt.transactionHash
      : transactionReceipt.hash,
  })
    .save()
    .catch(handleDuplicateKey);

  return [offerPool];
};
