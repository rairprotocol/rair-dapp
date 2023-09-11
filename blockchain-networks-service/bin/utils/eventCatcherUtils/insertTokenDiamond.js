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
  transactionData,
  // Contains
  /*
    network,
    transactionHash,
    fromAddress,
    diamondEvent,
  */
  erc721Address,
  rangeIndex,
  tokenIndex,
  // buyer, // We don't track ownership from this event anymore
) => {
  // Check if the contract is restricted
  const restrictedContract = await SyncRestriction.findOne({
    blockchain: transactionData.network,
    contractAddress: erc721Address.toLowerCase(),
    tokens: false,
  }).distinct('contractAddress');

  if (restrictedContract?.length > 0) {
    log.error(
      `[${transactionData.network}] Minted token from ${erc721Address} won't be stored!`,
    );
    return undefined;
  }

  // Find the contract data in the DB
  const contract = await findContractFromAddress(
    erc721Address.toLowerCase(),
    transactionData.network,
    transactionData.transactionHash,
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
    contract._id,
    offer.product,
    tokenIndex,
    foundToken,
  );

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
