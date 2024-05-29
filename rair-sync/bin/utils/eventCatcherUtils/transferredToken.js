const { constants } = require('ethers');
const { MintedToken } = require('../../models');
const { findContractFromAddress } = require('./eventsCommonUtils');

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
    return;
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

  await MintedToken.findOneAndUpdate(filter, update);
};
