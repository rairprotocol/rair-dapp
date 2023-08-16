/* eslint-disable consistent-return */

const {
  BigNumber,
} = require('ethers');
const { SyncRestriction, Product, Offer, MintedToken } = require('../../models');
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

  const offer = await Offer.findOne({
    contract: contract._id,
    diamondRangeIndex: rangeIndex,
  });

  const product = await Product.findOne({
    contract: contract._id,
    collectionIndexInContract: offer.product,
  });

  let foundToken = await MintedToken.findOne({
    contract: contract._id,
    token: tokenIndex,
  });

  foundToken = await handleMetadataForToken(
    dbModels,
    contract._id,
    offer.product,
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
  if (offer) {
    offer.soldCopies = BigNumber.from(offer.soldCopies).add(1).toString();
    await offer.save().catch(handleDuplicateKey);
  }

  // Decrease the amount of copies in the product
  if (product) {
    const allOffersInProduct = await Offer.find({
      contract: offer.contract,
      product: offer.product,
    });
    const totalSoldTokensInProduct = allOffersInProduct
      .reduce((result, currentOffer) => result + BigInt(currentOffer.soldCopies), 0n);
    product.soldCopies = totalSoldTokensInProduct.toString();
    await product.save().catch(handleDuplicateKey);
  }
  return foundToken;
};
