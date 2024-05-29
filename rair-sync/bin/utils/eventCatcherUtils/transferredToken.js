const { constants } = require('ethers');
const { MintedToken } = require('../../models');
const { findContractFromAddress } = require('./eventsCommonUtils');
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
  from,
  to,
  tokenId,
) => {
  const contract = await findContractFromAddress(
    transactionData.fromAddress,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const filter = {
    contract: contract._id,
    uniqueIndexInContract: tokenId.toString(),
    ownerAddress: from.toLowerCase(),
  };
  const update = {
    $set: {
      ownerAddress: to.toLowerCase(),
    },
  };

  if (from === constants.AddressZero) {
    filter.isMinted = false;
    update.$set.isMinted = true;
  }

  const foundToken = await MintedToken.findOneAndUpdate(filter, update);

  if (from === constants.AddressZero) {
    redisClient.set('notification', JSON.stringify({
      type: 'tokenMint',
      message: `Token #${tokenId} was minted!`,
      address: contract.user,
      additionalInfo: [foundToken._id],
    }));
  }

  return foundToken;
};
