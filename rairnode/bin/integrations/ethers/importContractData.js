const ethers = require('ethers');
const Moralis = require('moralis/node');
const fetch = require('node-fetch');
const endpoints = require('../../config/blockchainEndpoints');
const log = require('../../utils/logger')(module);


// Contract ABIs
// The RAIR721 contract is still an ERC721 compliant contract,
// so as long as standard functions are called,
// we can connect other NFTs contracts with this ABI
const Rair721 = require('./contracts/RAIR_ERC721.json').abi;

const insertTokens = async (tokens, contract, dbModels) => {
  let validCounter = 0;
  for await (const token of tokens) {
    let metadata;
    try {
      metadata = JSON.parse(token.metadata);
    } catch (err) {
      log.error('Cannot parse metadata!');
      console.log(token.metadata);
      continue;
    }
    if (metadata && metadata.image && token.owner_of) {
      // Handle images from IPFS (Use the moralis default gateway)
      metadata.image = metadata.image.replace('ipfs://', 'https://gateway.moralisipfs.com/ipfs/');
      if (!metadata.description) {
        metadata.description = 'No description available';
      }
      if (typeof metadata?.attributes?.at(0) === 'string') {
        metadata.attributes = metadata.attributes.map((item, index) => ({
          trait_type: '',
          value: item,
        }));
      }
      const newToken = await (new dbModels.MintedToken({
        ownerAddress: token.owner_of.toLowerCase(),
        metadataURI: token.token_uri,
        metadata,
        contract: contract._id,
        token: token.token_id,
        uniqueIndexInContract: token.token_id,
        isMinted: true,
        offer: 0,
        offerPool: 0,
        product: 0,
      })).save();
      validCounter++;
    }
  }
  return validCounter;
};

const wasteTime = (ms) => new Promise((resolve, reject) => {
  setTimeout(resolve, ms);
});

module.exports = {
  importContractData: async (networkId, contractAddress, userData, dbModels) => {
    try {
      Moralis.start({
        serverUrl: process.env.MORALIS_SERVER_TEST,
        appId: process.env.MORALIS_API_KEY_TEST,
      });

      let contract = await dbModels.Contract.findOne({
        contractAddress,
        blockchain: networkId,
        external: true,
      });

      if (!contract) {
        const options = {
          chain: networkId,
          address: contractAddress,
        };
        let allNFTs;
        try {
          allNFTs	= await Moralis.Web3API.token.getNFTOwners(options);
        } catch (err) {
          return {
            success: false,
            result: undefined,
            message: 'There was a problem importing the tokens!',
          };
        }

        log.info(`Found ${allNFTs.total}, with ${allNFTs.page_size} tokens on every page`);
        const timesNeeded = Math.round(allNFTs.total / allNFTs.page_size);
        log.info(`Need to do this ${timesNeeded} more times`);

        contract = await (new dbModels.Contract({
          user: 'UNKNOWN - External Import',
          title: allNFTs.result[0].name,
          contractAddress,
          blockchain: networkId,
          diamond: false,
          external: true,
        }));

        const product = await (new dbModels.Product({
          name: allNFTs.result[0].name,
          collectionIndexInContract: 0,
          contract: contract._id,
          copies: allNFTs.total,
          soldCopies: allNFTs.total,
          sold: true,
          firstTokenIndex: 0,
          transactionHash: 'UNKNOWN - External Import',
        }));

        const offer = await new dbModels.Offer({
          offerIndex: 0,
          contract: contract._id,
          product: 0,
          offerPool: 0,
          copies: allNFTs.total,
          soldCopies: allNFTs.total - 1,
          sold: true,
          price: 0,
          range: [0, allNFTs.total],
          offerName: allNFTs.result[0].name,
          transactionHash: 'UNKNOWN - External Import',
        });

        const offerPool = await (new dbModels.OfferPool({
          marketplaceCatalogIndex: 0,
          contract: contract._id,
          product: 0,
          rangeNumber: 0,
          transactionHash: 'UNKNOWN - External Import',
        }));

        let numberOfTokensAdded = await insertTokens(allNFTs.result, contract, dbModels);

        for (let i = 1; i <= timesNeeded; i++) {
          await wasteTime(10000);
          try {
            options.cursor = allNFTs.cursor;
            allNFTs = await Moralis.Web3API.token.getNFTOwners(options);
            numberOfTokensAdded += await insertTokens(allNFTs.result, contract, dbModels);
            log.info(`Inserted page ${i} of ${timesNeeded} for ${networkId}/${contractAddress} (${numberOfTokensAdded} NFTs so far)`);
          } catch (err) {
            log.error(err);
            return {
              success: false,
              result: undefined,
              message: 'There was a problem importing the tokens!',
            };
          }
        }

        if (numberOfTokensAdded === 0) {
          return {
            success: false,
            result: undefined,
            message: `Of the ${allNFTs.total} tokens inserted, none of them had metadata!`,
          };
        }

        await contract.save();
        await product.save();
        await offer.save();
        await offerPool.save();

        return {
          success: true,
          result: {
            contract,
            numberOfTokensAdded,
          },
          message: '',
        };
      }
      return { success: false, result: undefined, message: 'NFTs already imported' };
    } catch (err) {
      console.error(err);
      // console.log(err.errors);
    }
  },
};
