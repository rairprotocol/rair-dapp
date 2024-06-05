const { Contract } = require('../../models');
const { handleDuplicateKey } = require('./eventsCommonUtils');
const { redisPublisher } = require('../../services/redis');

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

  redisPublisher.publish('notifications', JSON.stringify({
    type: 'message',
    message: `Contract ${deploymentName} deployed!`,
    address: deployerAddress.toLowerCase(),
    data: [deploymentAddress.toLowerCase()],
  }));

  return [contract];
};
