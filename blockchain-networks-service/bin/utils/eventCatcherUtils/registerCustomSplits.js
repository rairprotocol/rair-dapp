const { findContractFromAddress } = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  contractAddress,
  recipients,
  remainderForSeller,
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

  const foundCustomSplit = await dbModels.CustomRoyaltiesSet.findOne({
    contract: contract._id,
  });

  if (foundCustomSplit) {
    foundCustomSplit.recipients = recipients;
    foundCustomSplit.remainderForSeller = remainderForSeller;
    foundCustomSplit.save();
    // console.log('Updated customSplits', foundCustomSplit);
  } else {
    new dbModels.CustomRoyaltiesSet({
      contract: contract._id,
      recipients,
      remainderForSeller,
    }).save();
    // console.log('New customSplits for ', chainId, contractAddress);
  }
};
