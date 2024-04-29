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

  let foundToken = await MintedToken.findOne({
    contract: contract._id,
    token: tokenIndex,
  });

  if (foundToken && offer) {
    foundToken = await handleMetadataForToken(
      contract._id,
      offer.product,
      tokenIndex,
      foundToken,
    );
  } else {
    log.error(`Cant find tokenid ${tokenIndex} from contract ${contract.blockchain} ${contract.contractAddress}, won't update metadata`);
  }

  if (offer) {
    const product = await Product.findOne({
      contract: contract._id,
      collectionIndexInContract: offer.product,
    });
    // Decrease the amount of copies in the offer
    offer.soldCopies = BigNumber.from(offer.soldCopies).add(1).toString();
    await offer.save().catch(handleDuplicateKey);
    const allOffersInProduct = await Offer.find({
      contract: offer.contract,
      product: offer.product,
    });
    if (product) {
      // Decrease the amount of copies in the product
      const totalSoldTokensInProduct = allOffersInProduct
        .reduce((result, currentOffer) => result + BigInt(currentOffer.soldCopies), 0n);
      product.soldCopies = totalSoldTokensInProduct.toString();
      await product.save().catch(handleDuplicateKey);
    }
  }

  return foundToken;
};
