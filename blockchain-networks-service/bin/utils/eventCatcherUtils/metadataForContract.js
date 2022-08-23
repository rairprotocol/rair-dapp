/* eslint-disable consistent-return */

const {
  findContractFromAddress,
  updateMetadataForTokens,
  log
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  newURI,
  // eslint-disable-next-line no-unused-vars
  appendTokenIndex = true,
  // Assume it's true for the classic contracts that don't have the append index feature
) => {
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
    dbModels,
  );
  log.info(`METADATA FOR CONTRACT =++++++++ > ${contract}`);

  if (!contract) {
    return;
  }
  contract.metadataURI = newURI;
  await contract.save();
  // Find products with common URIs set
  const products = await dbModels.Product.find({
    contract: contract._id,
  }).distinct('collectionIndexInContract');

  let foundOffers = [];
  if (products.length > 0) {
    // Find the offers tied to the products with common URIs
    foundOffers = await dbModels.Offer.find({
      contract: contract._id,
      product: { $nin: products },
    }).distinct('offerIndex');
  }

  // Update all tokens that have no unique URI set
  const foundTokensToUpdate = await dbModels.MintedToken.find({
    contract: contract._id,
    offerIndex: { $in: foundOffers },
    metadataURI: 'none',
  });
  // MB TODO: Same as above... and this is duplicate code
  updateMetadataForTokens(foundTokensToUpdate, appendTokenIndex, newURI);
  return newURI;
};
