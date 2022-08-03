const {
  handleDuplicateKey,
  findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  rangeIndex,
  name,
  price,
  tokensAllowed,
  lockedTokens,
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

  const foundOffer = await dbModels.Offer.findOne({
    contract: contract._id,
    diamond: diamondEvent,
    offerPool: undefined,
    diamondRangeIndex: rangeIndex,
  });
  if (!foundOffer) {
    return;
  }

  foundOffer.range[1] = tokensAllowed.add(foundOffer.range[0]);
  foundOffer.price = price;
  foundOffer.offerName = name;
  // MB:CHECK: Probably we need to return updated/new here.
  const updatedOffer = await foundOffer.save().catch(handleDuplicateKey);

  const foundLock = await dbModels.LockedTokens.findOne({
    contract: contract._id,
    lockIndex: rangeIndex,
    product: updatedOffer.product,
  });

  if (foundLock) {
    foundLock.range[1] = lockedTokens.add(foundLock.range[0]);
    await foundLock.save().catch(handleDuplicateKey);
  }

  // eslint-disable-next-line consistent-return
  return updatedOffer;
};
