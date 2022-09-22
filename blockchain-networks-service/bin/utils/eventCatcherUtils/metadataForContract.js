/* eslint-disable consistent-return */

const { BigNumber } = require('ethers');
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
  metadataExtension = ""
  // Assume extension is empty for contracts that don't have the extension feature
) => {
  // Because of the fallback system the contract-wide URI will affect
  // tokens without unique metadata in products without product-wide metadata

  //event UpdatedBaseURI(string newURI, bool appendTokenIndex, string _metadataExtension);
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
  contract.metadataURI = newURI;
  await contract.save();

  // Find products without general URIs set
  const products = await dbModels.Product.find({
    contract: contract._id,
    metadataURI: 'none'
  }).distinct('collectionIndexInContract');

  let foundOffers = [];
  if (products.length > 0) {
    // Find the offers tied to the products without common URIs
    foundOffers = await dbModels.Offer.find({
      contract: contract._id,
      product: { $in: products },
    }).distinct('offerIndex');
  }

  // Update all tokens that have no unique URI set
  const foundTokensToUpdate = await dbModels.MintedToken.find({
    contract: contract._id,
    offerIndex: { $in: foundOffers },
    metadataURI: 'none',
  });
  // MB TODO: Same as above... and this is duplicate code
  updateMetadataForTokens(foundTokensToUpdate, appendTokenIndex, newURI, undefined, metadataExtension);
  return newURI;
};
