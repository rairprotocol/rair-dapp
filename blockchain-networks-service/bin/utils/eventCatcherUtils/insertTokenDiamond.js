/* eslint-disable consistent-return */

const {
  BigNumber,
} = require('ethers');
const { SyncRestriction, LockedTokens, Product, Offer, MintedToken } = require('../../models');
const {
  handleDuplicateKey,
  handleMetadataForToken,
  findContractFromAddress,
  log,
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  erc721Address,
  rangeIndex,
  tokenIndex,
  buyer,
) => {
  // Check if the contract is restricted
  const restrictedContract = await SyncRestriction.findOne({
    blockchain: chainId,
    contractAddress: erc721Address.toLowerCase(),
    tokens: false,
  }).distinct('contractAddress');

  if (restrictedContract?.length > 0) {
    log.error(
      `[${chainId}] Minted token from ${erc721Address} won't be stored!`,
    );
    return undefined;
  }

  // Find the contract data in the DB
  const contract = await findContractFromAddress(
    erc721Address.toLowerCase(),
    chainId,
    transactionReceipt,
  );

  if (!contract) {
    return undefined;
  }

  // Find the token lock data
  const foundLock = await LockedTokens.findOne({
    contract: contract._id,
    lockIndex: rangeIndex, // For diamonds, lock index = range index = offer index
  });

  if (foundLock === null) {
    // Couldn't find a lock for diamond mint ${erc721Address}:${tokenIndex}`);
    return undefined;
  }

  // Find product
  const product = await Product.findOne({
    contract: contract._id,
    collectionIndexInContract: foundLock.product,
  });
  if (!product) {
    log.error(`404: Couldn't find product for ${contract._id}`);
    return [undefined];
  }

  const offerList = await Offer.find({
    contract: contract._id,
    product: product.collectionIndexInContract,
  });

  const [foundOffer] = offerList.filter((offer) => BigNumber.from(offer.range[0]).lte(tokenIndex) &&
            BigNumber.from(offer.range[1]).gte(tokenIndex));
  if (!foundOffer) {
    log.error(`404: Couldn't find offer for ${contract._id}`);
    return [undefined];
  }

  // Find token
  let foundToken = await MintedToken.findOne({
    contract: contract._id,
    token: tokenIndex,
  });

  // If token doesn't exist, create a new entry
  if (foundToken === null) {
    foundToken = new MintedToken({});
  }

  foundToken = await handleMetadataForToken(
    dbModels,
    contract._id,
    foundLock.product,
    tokenIndex,
    foundToken,
  );

  // Set all the properties of the minted token
  foundToken.token = tokenIndex;
  foundToken.uniqueIndexInContract = tokenIndex.add(product.firstTokenIndex);
  foundToken.ownerAddress = buyer;
  foundToken.offer = rangeIndex;
  foundToken.contract = contract._id;
  foundToken.isMinted = true;

  // Save the token data
  await foundToken?.save().catch(handleDuplicateKey);

  // Decrease the amount of copies in the offer
  if (foundOffer) {
    foundOffer.soldCopies = BigNumber.from(foundOffer.soldCopies).add(1).toString();
    await foundOffer.save().catch(handleDuplicateKey);
  }

  // Decrease the amount of copies in the product
  if (product) {
    const allOffersInProduct = await Offer.find({
      contract: foundOffer.contract,
      product: foundOffer.product,
    });
    const totalSoldTokensInProduct = allOffersInProduct
      .reduce((result, offer) => result + BigInt(offer.soldCopies), 0n);
    product.soldCopies = totalSoldTokensInProduct.toString();
    await product.save().catch(handleDuplicateKey);
  }
  return foundToken;
};
