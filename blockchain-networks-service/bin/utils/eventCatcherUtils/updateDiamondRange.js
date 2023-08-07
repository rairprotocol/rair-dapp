const {
  handleDuplicateKey,
  findContractFromAddress,
} = require('./eventsCommonUtils');

const { Offer } = require('../../models');

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
  );

  if (!contract) {
    return;
  }

  const foundOffer = await Offer.findOne({
    contract: contract._id,
    diamond: diamondEvent,
    offerPool: undefined,
    diamondRangeIndex: rangeIndex,
  });
  if (!foundOffer) {
    return;
  }

  foundOffer.allowedCopies = tokensAllowed;
  foundOffer.lockedCopies = lockedTokens;
  foundOffer.price = price;
  foundOffer.offerName = name;
  const updatedOffer = await foundOffer.save().catch(handleDuplicateKey);

  // eslint-disable-next-line consistent-return
  return updatedOffer;
};
