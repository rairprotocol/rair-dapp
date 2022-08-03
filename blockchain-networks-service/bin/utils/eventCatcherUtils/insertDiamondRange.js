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
  start,
  end,
  price,
  tokensAllowed, // Unused on the processing
  lockedTokens,
  name,
  rangeIndex,
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
  const offer = new dbModels.Offer({
    // offerIndex: undefined, // Offer is not defined yet
    contract: contract._id,
    product: productIndex,
    // offerPool: undefined, // Diamond contracts have no offer pools
    copies: end.sub(start),
    price,
    range: [start, end],
    offerName: name,
    diamond: true,
    diamondRangeIndex: rangeIndex,
    transactionHash: transactionReceipt.transactionHash
      ? transactionReceipt.transactionHash
      : transactionReceipt.hash,
  });

  await offer.save().catch(handleDuplicateKey);

  // Locks are always made on Diamond Contracts, they're part of the range event
  const tokenLock = new dbModels.LockedTokens({
    lockIndex: rangeIndex,
    contract: contract._id,
    product: productIndex,
    // Substract 1 because lockedTokens includes the start token
    range: [start, start.add(lockedTokens).sub(1)],
    lockedTokens,
    isLocked: true,
  });

  await tokenLock.save().catch(handleDuplicateKey);

  return offer;
};
