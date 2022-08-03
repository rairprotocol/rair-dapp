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
  contractAddress,
  offerIndex,
  rangeIndex,
  tokens,
  price,
  // eslint-disable-next-line no-unused-vars
  name,
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

  const foundOffer = await dbModels.Offer.findOne({
    contract: contract._id,
    diamond: false,
    offerPool: offerIndex,
    offerIndex: rangeIndex,
  });
  if (!foundOffer) {
    return;
  }

  foundOffer.range[1] = tokens.add(foundOffer.range[0]);
  foundOffer.price = price;

  // eslint-disable-next-line consistent-return
  return foundOffer.save().catch(handleDuplicateKey);
};
