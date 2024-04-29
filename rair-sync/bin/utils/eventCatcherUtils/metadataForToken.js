const { MintedToken } = require('../../models');
const {
  handleDuplicateKey,
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
  tokenId,
  newURI,
) => {
  const contract = await findContractFromAddress(
    transactionData.fromAddress,
    transactionData.network,
    transactionData.transactionHash,
  );

  if (!contract) {
    return undefined;
  }

  let fetchedMetadata = {};
  // New URI can come empty, it means it got unset
  if (newURI !== '') {
    try {
      fetchedMetadata = await (await fetch(newURI)).json();
    } catch (err) {
      log.error(`Error fetching '${newURI}': ${err}`);
    }
  }
  const foundToken = await MintedToken.findOne({
    contract: contract._id,
    uniqueIndexInContract: tokenId.toString(),
  });

  // The token exists, update the metadata for that token
  if (foundToken) {
    foundToken.metadata = fetchedMetadata;
    foundToken.metadataURI = newURI;
    foundToken.isMetadataPinned = true;
    foundToken.isURIStoredToBlockchain = true;
    await foundToken.save().catch(handleDuplicateKey);
  }
  return foundToken;
};
