const { Contract } = require('../../models');
const { handleDuplicateKey } = require('./eventsCommonUtils');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  deployerAddress,
  deploymentIndex,
  deploymentAddress,
  deploymentName = 'UNKNOWN',
) => {
  const contract = new Contract({
    diamond: transactionData.diamondEvent,
    transactionHash: transactionData.transactionHash,
    title: deploymentName,
    user: deployerAddress,
    blockchain: transactionData.network,
    contractAddress: deploymentAddress.toLowerCase(),
    lastSyncedBlock: 0,
    external: false,
  })
    .save()
    .catch(handleDuplicateKey);

  return [contract];
};
