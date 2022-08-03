/* eslint-disable consistent-return */

const {
  handleDuplicateKey,
  findContractFromAddress,
  handleMetadataForToken,
  log,
} = require('./eventsCommonUtils');
const insertTokenDiamond = require('./insertTokenDiamond');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  ownerAddress,
  contractAddress,
  catalogIndex,
  rangeIndex,
  tokenIndex,
) => {
  if (diamondEvent) {
    // This is a special case of a token minted before the events were renamed
    // The data will be sent to the diamond version of the tokenMinted handler
    // Because even though the names were the same, the signature is different
    const insertResult = await insertTokenDiamond(
      dbModels,
      chainId,
      transactionReceipt,
      diamondEvent,
      // These 4 events are not really what they're called
      ownerAddress, // Argument 0 of the real event is erc721Address
      contractAddress, // Argument 2 of the real event is rangeIndex
      catalogIndex, // Argument 3 of the real event is tokenIndex
      rangeIndex, // Argument 4 of the real event is buyer
    );
    return insertResult;
  }

  const forbiddenContract = await dbModels.SyncRestriction.findOne({
    blockchain: chainId,
    contractAddress: contractAddress.toLowerCase(),
    tokens: false,
  }).distinct('contractAddress');

  if (forbiddenContract?.length > 0) {
    log.error(`Minted token from ${contractAddress} can't be stored!`);
    return [undefined];
  }

  const contract = await findContractFromAddress(
    contractAddress.toLowerCase(),
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  const offerPool = await dbModels.OfferPool.findOne({
    contract: contract._id,
    marketplaceCatalogIndex: catalogIndex,
  });

  if (offerPool === null) {
    log.error("Couldn't find offer pool");
    return [undefined];
  }

  const product = await dbModels.Product.findOne({
    contract: contract._id,
    collectionIndexInContract: offerPool.product,
  });

  if (!product) {
    log.error(`Couldn't find product for ${contractAddress}`);
    return [undefined];
  }

  const offers = await dbModels.Offer.find({
    contract: contract._id,
    offerPool: offerPool.marketplaceCatalogIndex,
  });

  const [foundOffer] = offers.filter(
    (item) => tokenIndex >= item.range[0] && tokenIndex <= item.range[1],
  );

  if (!foundOffer) {
    log.error("Couldn't find offer!");
    return [undefined];
  }

  let foundToken = await dbModels.MintedToken.findOne({
    contract: contract._id,
    offerPool: offerPool.marketplaceCatalogIndex,
    token: tokenIndex,
  });

  if (foundToken === null) {
    foundToken = new dbModels.MintedToken({});
  }

  foundToken = await handleMetadataForToken(
    dbModels,
    contract._id,
    offerPool.product,
    tokenIndex,
    foundToken,
  );

  foundToken.token = tokenIndex;
  foundToken.uniqueIndexInContract = tokenIndex.add(product.firstTokenIndex);
  foundToken.ownerAddress = ownerAddress;
  foundToken.offerPool = catalogIndex;
  foundToken.offer = foundOffer.offerIndex;
  foundToken.contract = contract._id;
  foundToken.isMinted = true;

  foundOffer.soldCopies += 1;
  product.soldCopies += 1;

  foundToken.save().catch(handleDuplicateKey);
  foundOffer.save().catch(handleDuplicateKey);
  product.save().catch(handleDuplicateKey);

  return [foundToken, foundOffer, product];
};
