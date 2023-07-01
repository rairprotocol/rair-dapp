/* eslint-disable consistent-return */

const { findContractFromAddress } = require('./eventsCommonUtils');
const { Offer } = require('../../models');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  address,
  rangeIndex,
  feeSplitsLength,
  visible,
  offerIndex,
) => {
  const contract = await findContractFromAddress(
    address,
    chainId,
    transactionReceipt,
  );

  if (!contract) {
    return;
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
