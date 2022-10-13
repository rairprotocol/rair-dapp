/* eslint-disable consistent-return */

const {
  handleDuplicateKey,
  handleMetadataForToken,
  findContractFromAddress,
  log,
} = require('./eventsCommonUtils');
const {
  BigNumber
} = require("ethers");

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
  const restrictedContract = await dbModels.SyncRestriction.findOne({
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
    dbModels,
  );

  if (!contract) {
    return undefined;
  }

  // Find the token lock data
  const foundLock = await dbModels.LockedTokens.findOne({
    contract: contract._id,
    lockIndex: rangeIndex, // For diamonds, lock index = range index = offer index
  });

  if (foundLock === null) {
    // Couldn't find a lock for diamond mint ${erc721Address}:${tokenIndex}`);
    return undefined;
  }

  // Find product
  const product = await dbModels.Product.findOne({
    contract: contract._id,
    collectionIndexInContract: foundLock.product,
  });
  if (!product) {
    log.error(`404: Couldn't find product for ${contract._id}`);
    return [undefined];
  }

  const offerList = await dbModels.Offer.find({
    contract: contract._id,
    product: product.collectionIndexInContract
  });
  const [foundOffer] = offerList.filter(offer => {
    return BigNumber.from(offer.range[0]).lt(tokenIndex) &&
            BigNumber.from(offer.range[1]).gt(tokenIndex) 
  });
  if (!foundOffer) {
    log.error(`404: Couldn't find offer for ${contract._id}`);
    return [undefined];
  }

  // Find token
  let foundToken = await dbModels.MintedToken.findOne({
    contract: contract._id,
    token: tokenIndex,
  });

  // If token doesn't exist, create a new entry
  if (foundToken === null) {
    foundToken = new dbModels.MintedToken({});
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

  // Decrease the amount of copies in the offer
  if (foundOffer) {
    foundOffer.soldCopies += 1;
    foundOffer.save().catch(handleDuplicateKey);
  }

  // Decrease the amount of copies in the product
  if (product) {
    product.soldCopies += 1;
    product.save().catch(handleDuplicateKey);
  }

  // Save the token data
  foundToken?.save().catch(handleDuplicateKey);

  return foundToken;
};
