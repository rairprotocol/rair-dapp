/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

const fetch = require('node-fetch');
const { constants, BigNumber } = require('ethers');
const _ = require('lodash');
const { addMetadata, addPin } = require('../../integrations/ipfsService')();
const log = require('../logger')(module);
const { Contract, Product, MintedToken } = require('../../models');

const fetchJson = async (URL) => {
  try {
    const metadata = await (await fetch(URL)).json();
    if (
      !metadata.description ||
        metadata.description !== '' ||
        !metadata.name ||
        metadata.name !== ''
    ) {
      return metadata;
    }
    log.error(
      `Metadata from ${URL} is missing required fields! (Description or name)`,
    );
  } catch (err) {
    log.error(`Couldn't load metadata from ${URL}, skipping!`);
  }
  return false;
};

const handleDuplicateKey = (err) => {
  if (err.code === 11000) {
    log.error(`Duplicate keys found! ${err.keyValue.toString()}`);
  } else {
    throw err;
  }
};

const handleMetadataForToken = async (
  dbModels,
  contractId,
  collectionIndex,
  tokenIndex,
  tokenInstance,
) => {
  // !1.- Direct metadata on the token
  if (
    tokenInstance.isMetadataPinned &&
      tokenInstance.metadataURI !== 'none'
  ) {
    // regex check for valid URI -> tokenInstance.metadataURI
    if (_.get(tokenInstance.metadata, 'name')) {
      return tokenInstance;
    }
    // TODO: else {throw / log have URI and meta not populated}
    // if token has URI then no update needed but
    // we need to inform network LOG
  }

  // 2.- Product wide metadata
  const foundProduct = await Product.findOne({
    contract: contractId,
    collectionIndexInContract: collectionIndex,
  });
  let foundMetadataURI = foundProduct.metadataURI;
  if (foundMetadataURI === 'none' || foundProduct.singleMetadata === false) {
    // 3.- Contract wide metadata
    const foundContract = await Contract.findOne({
      _id: contractId,
    });
    foundMetadataURI = foundContract.singleMetadata
      ? foundContract.metadataURI
      : 'none';
  }
  // According to agreed logic this step won't have pin in it
  // in such cases meta should be already preset and pined to pinata
  if (foundMetadataURI !== 'none' && tokenInstance.metadataURI === 'none') {
    // If single metadata exists, set it as the token's metadata
    log.info('New token has single Metadata preset!');
    const fetchedMetadata = await fetchJson(foundMetadataURI);
    tokenInstance.metadata = fetchedMetadata;
    tokenInstance.isMetadataPinned = true;
  } else if (
    tokenInstance?.metadata?.name !== 'none' &&
      tokenInstance.metadataURI === 'none' &&
      tokenInstance.isMetadataPinned === false
  ) {
    // If metadata from the blockchain doesn't exist
    // but the database has metadata, pin it and set it.
    const CID = await addMetadata(
      tokenInstance.metadata,
      tokenInstance.metadata.name,
    );
    await addPin(CID, `metadata_${tokenInstance.metadata.name}`);
    tokenInstance.metadataURI = `${process.env.PINATA_GATEWAY}/${CID}`;
    tokenInstance.isMetadataPinned = true;
    log.info(
      `New token has Metadata from the database! Pinned with CID: ${CID}`,
    );
  } else {
    log.info(`Minted token ${contractId}:${tokenIndex} has no metadata!`);
  }
  tokenInstance.isURIStoredToBlockchain = false;
  return tokenInstance;
};

const findContractFromAddress = async (
  address,
  network,
  transactionReceipt,
  dbModels,
) => {
  const contract = await Contract.findOne({
    contractAddress: address.toLowerCase(),
    blockchain: network,
  });
  if (contract === null) {
    // MB:TODO: throw error?
    log.error(
      `[${network}] Error parsing tx ${transactionReceipt.transactionHash}, couldn't find a contract entry for address ${address}`,
    );
    return;
  }
  if (contract.blockSync) {
    log.info(
      `Caught event for contract ${address} - skipping as sync is blocked`,
    );
    return undefined;
  }
  return contract;
};

const updateMetadataForTokens = async (
  tokens,
  appendTokenIndexFlag,
  newURI,
  collectionWideFlag,
  metadataExtension = '',
) => {
  let tokensToUpdate = [];
  if (newURI !== '') {
    try {
      await fetch(newURI);
    } catch (err) {
      log.error('Was unable to fetch URI', err);
      throw err;
    }
  } else {
    log.info(
      'Updating metadata with a blank string (This means the metadata got unset)',
    );
  }
  if (tokens.length > 0) {
    if (appendTokenIndexFlag && newURI) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const token of tokens) {
        let fetchedMetadata = {};
        if (newURI !== '') {
          fetchedMetadata = await fetchJson(collectionWideFlag
            ? `${newURI}${token.token}${metadataExtension}`
            : `${newURI}${token.uniqueIndexInContract}${metadataExtension}`);
        }
        if (!fetchedMetadata) {
          // eslint-disable-next-line no-continue
          continue;
        }
        token.metadata = fetchedMetadata;
        token.isMetadataPinned = true;
        token.isURIStoredToBlockchain = true;
        tokensToUpdate.push(token.save().catch(handleDuplicateKey));
      }
    } else {
      let fetchedMetadata = '';
      if (newURI !== '') {
        fetchedMetadata = await fetchJson(newURI);
      }
      tokensToUpdate = tokens.reduce((data, token) => {
        token.metadata = fetchedMetadata;
        token.isMetadataPinned = true;
        token.isURIStoredToBlockchain = true;
        data.push(token.save().catch(handleDuplicateKey));
        return data;
      }, []);
    }
    if (tokensToUpdate.length > 0) {
      const tokensSaveStatus = await Promise.allSettled(tokensToUpdate);
      if (tokensSaveStatus.find((el) => el === 'rejected')) {
        log.error(
          'Was unable to save some of the tokens during batch meta update',
        );
      } else {
        log.info('Batch tokens update successful');
      }
    }
  } else {
    log.info('updateMetadataForTokens: no token to update');
  }
};

const generateTokensCollectionByRange = async (contract, offer, dbModels) => {
  const [start, end] = offer.range;
  const array = [];

  const { firstTokenIndex } = await Product.findOne({
    contract: offer.contract,
    collectionIndexInContract: offer.product,
  });

  for (let i = BigNumber.from(start); i.lte(end); i = i.add(1)) {
    array.push(new MintedToken({
      token: i.toString(),
      uniqueIndexInContract: BigNumber.from(firstTokenIndex).add(i).toString(),
      ownerAddress: constants.AddressZero,
      contract: contract._id,
      offer: offer.diamondRangeIndex,
      offerPool: offer.offerIndex,
      isMinted: false,
    }));
  }

  return array;
};

module.exports = {
  handleMetadataForToken,
  handleDuplicateKey,
  findContractFromAddress,
  generateTokensCollectionByRange,
  updateMetadataForTokens,
  log,
};
