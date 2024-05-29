const { findContractFromAddress } = require('./eventsCommonUtils');
const { Offer } = require('../../models');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
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
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const foundOffer = await Offer.findOneAndUpdate(
    {
      contract: contract._id,
      offerName: rangeName,
      price,
      diamondRangeIndex: rangeIndex,
      hidden: !visible,
    },
    // If offer index doesn't exist then it's an old version of the event
    // And 'visible' would hold the data for 'offerIndex'
    { offerIndex: offerIndex || visible },
  );

  return foundOffer;
};
