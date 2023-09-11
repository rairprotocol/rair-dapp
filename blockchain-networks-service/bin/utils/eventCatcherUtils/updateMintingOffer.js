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
  address,
  rangeIndex,
  feeSplitsLength,
  visible,
  offerIndex,
) => {
  const contract = await findContractFromAddress(
    address,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  const foundOffer = await Offer.findOneAndUpdate(
    {
      contract: contract._id,
      diamondRangeIndex: rangeIndex,
    },
    {
      offerIndex: offerIndex || visible,
      hidden: !visible,
    },
  );

  return foundOffer;
};
