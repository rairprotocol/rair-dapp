/* eslint-disable consistent-return */

const { findContractFromAddress } = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  erc721Address,
  rangeIndex,
  rangeName,
  price,
  feeSplitsLength,
  visible,
  offerIndex,
) => {
  const contract = await findContractFromAddress(
    erc721Address,
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  const foundOffer = await dbModels.Offer.findOneAndUpdate(
    {
      contract: contract._id,
      offerName: rangeName,
      price,
      diamondRangeIndex: rangeIndex,
    },
    // If offer index doesn't exist then it's an old version of the event
    // And 'visible' would hold the data for 'offerIndex'
    { offerIndex: offerIndex || visible },
  );

  return foundOffer;
};
