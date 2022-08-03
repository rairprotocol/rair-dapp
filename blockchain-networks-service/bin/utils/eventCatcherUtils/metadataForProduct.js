/* eslint-disable consistent-return */

const {
  findContractFromAddress,
  updateMetadataForTokens,
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  productId,
  newURI,
  // eslint-disable-next-line no-unused-vars
  appendTokenIndex = true, // MB:CHECK: this is not clear...
) => {
  const fetchedMetadata = await (await fetch(newURI)).json();
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
    dbModels,
  );
  if (!contract) {
    // MB:TODO: can remove in case findContractFromAddress
    // will throw error insted of returning log to console
    return;
    // throw new Error(
    //   'Contract not fount, terminated metadataForProduct Update...',
    // );
  }
  const product = await dbModels.Product.findOneAndUpdate(
    {
      contract: contract._id,
      collectionIndexInContract: productId,
    },
    { $set: { metadataURI: newURI } },
    { returnNewDocument: true },
  );
  // /|\ this is secure as cannot create new document,
  // updates only one field and do not trigger anything
  // MB:CHECK: no offerpools?
  const foundOffers = await dbModels.Offer.find({
    contract: contract._id,
    product: productId,
  }).distinct('offerIndex');
  const tokens = await dbModels.MintedToken.find({
    contract: contract._id,
    offerIndex: { $in: foundOffers },
    metadataURI: 'none',
  });
  await updateMetadataForTokens(tokens, fetchedMetadata);
  return product;
};
