const { Offer, MintedToken, Product } = require('../../models');
const {
  findContractFromAddress,
  updateMetadataForTokens,
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
  productId,
  newURI,
  // eslint-disable-next-line no-unused-vars
  appendTokenIndex = false,
  // Assume events without this flag are old and don't append the token
  metadataExtension = '',
  // Assume events without this field are old and don't have extension
) => {
  const contract = await findContractFromAddress(
    transactionData.fromAddress,
    transactionData.network,
    transactionData.transactionHash,
  );
  if (!contract) {
    return undefined;
  }
  const product = await Product.findOneAndUpdate(
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
  const foundOffers = await Offer.find({
    contract: contract._id,
    product: productId,
  }).distinct('offerIndex');
  const tokens = await MintedToken.find({
    contract: contract._id,
    offerIndex: { $in: foundOffers },
    metadataURI: 'none',
  });
  await updateMetadataForTokens(
    tokens,
    appendTokenIndex,
    newURI,
    appendTokenIndex,
    metadataExtension,
  );
  return product;
};
