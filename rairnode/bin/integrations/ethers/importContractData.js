/* eslint-disable no-restricted-syntax */
const { Network, Alchemy } = require('alchemy-sdk');
const fetch = require('node-fetch');
const log = require('../../utils/logger')(module);

// Contract ABIs
// The RAIR721 contract is still an ERC721 compliant contract,
// so as long as standard functions are called,
// we can connect other NFTs contracts with this ABI

const insertToken = async (token, contractId, dbModels) => {
  let metadata;
  if (token.metadataError !== undefined) {
    log.error(`Error importing token #${token.tokenId}: ${token.metadataError}`);
    return false;
  }
  if (!token.rawMetadata && token.tokenUri) {
    try {
      log.info(`${token.token_id} has no metadata in Moralis, will try to fetch metadata from ${token.tokenUri}`);
      metadata = await (await fetch(token.tokenUri.gateway)).json();
      // console.log('Fetched data', metadata);
    } catch (err) {
      log.error('Cannot fetch metadata URI!');
      return false;
    }
  } else {
    // Use the image loaded in the metadata
    metadata = token?.rawMetadata;
    if (!metadata.image) {
      if (token?.metadata?.at) {
        metadata.image = token?.media?.at(0)?.gateway;
      } else {
        metadata.image = token?.media?.gateway;
      }
    }
    // Use the image from Alchemy's gateway
    // We do it regardless of the value in rawMetadata because some ipfs gateways
    // get disabled over time, Alchemy's gateway should be more reliable
    if (!metadata.image) {
      // Use the raw IPFS link and use the default gateway
      metadata.image = token?.media?.raw;
    }
    if (metadata.image) {
      // If the ipfs prefix still exists, replace it
      metadata.image = metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
  }
  if (metadata && metadata.image && metadata.name && token.owner) {
    // Handle images from IPFS (Use the moralis default gateway)
    if (!metadata.description) {
      metadata.description = 'No description available';
    }
    if (typeof metadata?.attributes?.at(0) === 'string') {
      metadata.attributes = metadata.attributes.map((item) => ({
        trait_type: '',
        value: item,
      }));
    }
    try {
      await (new dbModels.MintedToken({
        ownerAddress: token.owner.toLowerCase(),
        metadataURI: token.token_uri,
        metadata,
        contract: contractId,
        token: token.tokenId,
        uniqueIndexInContract: token.tokenId,
        isMinted: true,
        offer: 0,
        offerPool: 0,
        product: 0,
      })).save();
    } catch (error) {
      log.error(`Error inserting token ${token.token_id}, ${error.name}`);
    }
  }
  return true;
};

// Used to be to avoid Moralis rate limiting
const wasteTime = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const alchemyMapping = {
  '0x1': Network.ETH_MAINNET,
  '0x5': Network.ETH_GOERLI,
  '0x89': Network.MATIC_MAINNET,
  '0x13881': Network.MATIC_MUMBAI,
};

module.exports = {
  importContractData: async (networkId, contractAddress, limit, contractCreator, dbModels) => {
    let contract;

    // Optional Config object, but defaults to demo api-key and eth-mainnet.
    const settings = {
      apiKey: process.env.ALCHEMY_API_KEY, // ''
      network: alchemyMapping[networkId], // Replace with your network.
    };
    if (!settings.network) {
      return { success: false, result: undefined, message: 'Invalid blockchain' };
    }
    const alchemy = new Alchemy(settings);

    contract = await dbModels.Contract.findOne({
      contractAddress,
      blockchain: networkId,
      external: true,
    });

    if (contract) {
      return { success: false, result: undefined, message: 'NFTs already imported' };
    }

    const contractMetadata = await alchemy.nft.getContractMetadata(contractAddress);

    if (contractMetadata.tokenType !== 'ERC721') {
      return { success: false, result: undefined, message: `Only ERC721 is supported, tried to process a ${contractMetadata.tokenType} contract` };
    }

    contract = await (new dbModels.Contract({
      user: contractCreator,
      title: contractMetadata.name,
      contractAddress,
      blockchain: networkId,
      diamond: false,
      external: true,
    }));

    const product = await (new dbModels.Product({
      name: contractMetadata.name,
      collectionIndexInContract: 0,
      contract: contract._id,
      copies: contractMetadata.totalSupply,
      soldCopies: contractMetadata.totalSupply,
      sold: true,
      firstTokenIndex: 0,
      transactionHash: 'UNKNOWN - External Import',
    }));

    const offer = await new dbModels.Offer({
      offerIndex: 0,
      contract: contract._id,
      product: 0,
      offerPool: 0,
      copies: contractMetadata.totalSupply,
      soldCopies: contractMetadata.totalSupply - 1,
      sold: true,
      price: '0',
      range: [0, contractMetadata.totalSupply],
      offerName: contractMetadata.name,
      transactionHash: 'UNKNOWN - External Import',
    });

    const offerPool = await (new dbModels.OfferPool({
      marketplaceCatalogIndex: 0,
      contract: contract._id,
      product: 0,
      rangeNumber: 0,
      transactionHash: 'UNKNOWN - External Import',
    }));

    // Can't be used, it doesn't say which NFT they own
    // console.log(await alchemy.nft.getOwnersForContract(contractAddress));

    let numberOfTokensAdded = 0;
    for await (const nft of alchemy.nft.getNftsForContractIterator(contractAddress, {
      omitMetadata: false,
    })) {
      const ownerResponse = await alchemy.nft.getOwnersForNft(nft.contract.address, nft.tokenId);
      [nft.owner] = ownerResponse.owners;
      if (insertToken(nft, contract._id, dbModels)) {
        numberOfTokensAdded += 1;
      }
      if (limit !== '0' && numberOfTokensAdded >= limit) {
        break;
      }
    }

    if (numberOfTokensAdded === 0) {
      return {
        success: false,
        message: 'An error has occurred, 0 tokens imported from the contract',
      };
    }

    try {
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
    } catch (err) {
      log.error(err);
      if (contract) {
        dbModels.MintedToken.deleteMany({ contract: contract._id });
        dbModels.Offer.deleteMany({ contract: contract._id });
        dbModels.Product.deleteMany({ contract: contract._id });
      }
      return {
        success: false,
        message: 'An error has ocurred!',
      };
    }
  },
};
