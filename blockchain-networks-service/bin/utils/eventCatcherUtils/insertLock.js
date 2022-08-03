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
  productIndex,
  startingToken,
  endingToken,
  tokensLocked,
  productName,
  lockIndex,
) => {
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  const lockedTokens = new dbModels.LockedTokens({
    lockIndex,
    contract: contract._id,
    product: productIndex,
    range: [startingToken, endingToken],
    lockedTokens: tokensLocked,
    isLocked: true,
  })
    .save()
    .catch(handleDuplicateKey);

  return [lockedTokens];
};
