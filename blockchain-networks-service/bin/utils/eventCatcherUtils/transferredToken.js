const { MintedToken } = require('../../models');
const { findContractFromAddress } = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  from,
  to,
  tokenId,
) => {
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
  );

  if (!contract) {
    return;
  }

  await MintedToken.findOneAndUpdate({
    contract: contract._id,
    uniqueIndexInContract: tokenId.toString(),
    ownerAddress: from.toLowerCase(),
  }, {
    $set: {
      ownerAddress: to.toLowerCase(),
    },
  });
};
