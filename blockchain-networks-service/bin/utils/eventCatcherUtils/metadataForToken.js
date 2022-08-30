/* eslint-disable consistent-return */

const {
  handleDuplicateKey,
  findContractFromAddress,
  log
} = require('./eventsCommonUtils');

module.exports = async (
  dbModels,
  chainId,
  transactionReceipt,
  diamondEvent,
  tokenId,
  newURI,
) => {
  const contract = await findContractFromAddress(
    transactionReceipt.to
      ? transactionReceipt.to
      : transactionReceipt.to_address,
    chainId,
    transactionReceipt,
    dbModels,
  );

  if (!contract) {
    return;
  }

  let fetchedMetadata = {};
  // New URI can come empty, it means it got unset
  if (newURI !== '') {
    try {
      fetchedMetadata = await (await fetch(newURI)).json();
    } catch (err) {
      log.error(`Error fetching '${newURI}': ${err}`)
    }
  }
  const foundToken = await dbModels.MintedToken.findOne({
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
