const { Offer } = require('../../models');
const {
  handleDuplicateKey,
  findContractFromAddress,
  generateTokensCollectionByRange,
  log,
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
  productIndex,
  start,
  end,
  price,
  tokensAllowed,
  lockedTokens,
  name,
  rangeIndex,
) => {
  const contract = await findContractFromAddress(
    transactionData.fromAddress,
    transactionData.network,
    transactionData.transactionHash,
  );
  if (!contract) {
    return undefined;
  }
  const searchParam = {
    diamondRangeIndex: rangeIndex,
    contract: contract._id,
    product: productIndex,
  };
  // check if offer already exists:
  let offer = await Offer.findOne(searchParam);
  if (!offer) {
    offer = new Offer({
      // offerIndex: undefined, // Offer is not defined yet
      contract: contract._id,
      product: productIndex,
      // offerPool: undefined, // Diamond contracts have no offer pools
      copies: end.sub(start),
      price,
      allowedCopies: tokensAllowed,
      lockedCopies: lockedTokens,
      range: [start, end],
      offerName: name,
      diamond: true,
      diamondRangeIndex: rangeIndex,
      transactionHash: transactionData.transactionHash,
      sponsored: false,
    });
    await offer.save().catch(handleDuplicateKey);

    // tokens docs in DB
    const tokenDocuments = await generateTokensCollectionByRange(contract, offer);
    log.info(`Storing ${tokenDocuments.length} tokens from the new range: ${name}`);
    // eslint-disable-next-line no-restricted-syntax
    for await (const tokenDoc of tokenDocuments) {
      await tokenDoc.save().catch(handleDuplicateKey);
    }
  }
  return offer;
};
