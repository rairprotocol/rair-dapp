const { Offer } = require('../../models');
const {
  handleDuplicateKey,
  findContractFromAddress,
} = require('./eventsCommonUtils');

module.exports = async (
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
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
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return;
  }

  const foundOffer = await Offer.findOne({
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
