const { Product, Offer, MintedToken } = require('../../models');
const {
  handleDuplicateKey,
  handleMetadataForToken,
  findContractFromAddress,
  log,
} = require('./eventsCommonUtils');

// Handles the MintedToken event from the Diamond Marketplace

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
  // Find the contract data in the DB
  const contract = await findContractFromAddress(
    erc721Address.toLowerCase(),
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract || contract.blockSync) {
    return undefined;
  }

  const offer = await Offer.findOne({
    contract: contract._id,
    diamondRangeIndex: rangeIndex,
  });

  let foundToken = await MintedToken.findOne({
    contract: contract._id,
    token: tokenIndex,
    offer: rangeIndex,
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

    // Get the number of minted tokens in the offer
    const mintedTokens = await MintedToken.find({
      contract: contract._id,
      product: offer.product,
      isMinted: true,
    });
    let thisIncluded = false;
    offer.soldCopies = mintedTokens.reduce((result, token) => {
      if (token.token === tokenIndex) {
        thisIncluded = true;
      }
      return result + BigInt(token.offer.toString() === offer.diamondRangeIndex.toString());
    }, 0n);
    if (!thisIncluded) {
      offer.soldCopies += 1n;
    }

    await offer.save().catch(handleDuplicateKey);
    if (product) {
      product.soldCopies = mintedTokens.length.toString();
      await product.save().catch(handleDuplicateKey);
    }
  }

  return foundToken;
};
