/* eslint-disable consistent-return */

const { handleDuplicateKey } = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  deployerAddress,
  deploymentIndex,
  deploymentAddress,
  deploymentName = 'UNKNOWN',
) => {
  const transactionHash = transactionReceipt.transactionHash
    ? transactionReceipt.transactionHash
    : transactionReceipt.hash;

  const contract = new dbModels.Contract({
    diamond: diamondEvent,
    transactionHash,
    title: deploymentName,
    user: deployerAddress,
    blockchain: chainId,
    contractAddress: deploymentAddress.toLowerCase(),
    lastSyncedBlock: 0,
    external: false,
  })
    .save()
    .catch(handleDuplicateKey);

  return [contract];
};
