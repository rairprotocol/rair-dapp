/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

const fetch = require('node-fetch');
const _ = require('lodash');
const { addMetadata, addPin } = require('../../integrations/ipfsService')();
const log = require('../logger')(module);

module.exports = {
  handleMetadataForToken: async (
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
    const foundProduct = await dbModels.Product.findOne({
      contract: contractId,
      collectionIndexInContract: collectionIndex,
    });
    let foundMetadataURI = foundProduct.metadataURI;
    if (foundMetadataURI === 'none' || foundProduct.singleMetadata === false) {
      // 3.- Contract wide metadata
      const foundContract = await dbModels.Contract.findOne({
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
      const fetchedMetadata = await (await fetch(foundMetadataURI)).json();
      tokenInstance.metadata = fetchedMetadata;
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
      log.info(`Minted token ${tokenInstance}has no metadata!`);
    }

    return tokenInstance;
  },
  handleDuplicateKey: (err) => {
    if (err.code === 11000) {
      log.error(`Duplicate keys found! ${err.keyValue.toString()}`);
    } else {
      throw err;
    }
  },

  findContractFromAddress: async (
    address,
    network,
    transactionReceipt,
    dbModels,
  ) => {
    const contract = await dbModels.Contract.findOne({
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
    return contract;
  },
  updateMetadataForTokens: async (tokens, fetchedMetadata) => {
    if (tokens.length > 0) {
      const tokensToUpdate = tokens.reduce((data, token) => {
        token.metadata = fetchedMetadata;
        token.isMetadataPinned = true;
        data.push(token.save().catch(this.handleDuplicateKey));
        return data;
      }, []);
      if (tokensToUpdate) {
        const tokensSaveStatus = await Promise.allSettled(tokensToUpdate);
        if (tokensSaveStatus.find((el) => el === 'rejected')) {
          log.info(
            'Was unable to save some of the tokens during batch meta update',
          );
        } else {
          log.info('Batch tokens update successful');
        }
      }
    } else {
      log.info('updateMetadataForTokens: no token to update');
    }
  },
  log
};
