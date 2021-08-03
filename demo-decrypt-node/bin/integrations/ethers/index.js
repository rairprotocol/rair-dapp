const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Market = require('./contracts/Minter_Marketplace.json').abi;
const ERC777 = require('./contracts/RAIR777.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;
const log = require('../../utils/logger')(module);

const { nanoid } = require('nanoid');
const _ = require('lodash');

module.exports = async (db) => {
// Connect to the Binance Testnet
  const binanceTestnetProvider = new ethers.providers.JsonRpcProvider(process.env.BINANCE_TESTNET, {
    chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
  });

  const infuraTestnetProvider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_PROJECT_ID);

// These connections don't have an address associated, so they can read but can't write to the blockchain
// BNB
  const factoryInstanceBNB = await new ethers.Contract(process.env.FACTORY_ADDRESS, Factory, binanceTestnetProvider);
  const minterMarketplaceInstanceBNB = await new ethers.Contract(process.env.MINTER_MARKETPLACE_ADDRESS, Market, binanceTestnetProvider);

// Ethereum
  const factoryInstanceETH = await new ethers.Contract(process.env.FACTORY_ADDRESS, Factory, infuraTestnetProvider);
  const minterMarketplaceInstanceETH = await new ethers.Contract(process.env.MINTER_MARKETPLACE_ADDRESS, Market, infuraTestnetProvider);

  // Helpers
  const setProductListeners = async (contractAddress) => {
    const tokenInstance = new ethers.Contract(contractAddress, Token, binanceTestnetProvider);
    const contract = contractAddress.toLowerCase();

    tokenInstance.on('CollectionCreated(uint256,string,uint256)', async (index, name, copies) => {
      try {
        await db.Product.create({
          name,
          collectionIndexInContract: index,
          contract,
          // resaleEnabled: false,
          copies
        });

        log.info(`RAIR: New Product ID#${ index } created for Contract  ${ contract } with ${ copies } tokens`);
      } catch (err) {
        log.error(err);
      }
    });

    tokenInstance.on('CollectionCompleted(uint256,string)', async (index, name) => {
      try {
        await db.Product.findOneAndUpdate({ collectionIndexInContract: index, contract }, { sold: true });

        log.info(`RAIR: collection #${ index } with name "${ name }" ran out of mintable copies!`);
      } catch (err) {
        log.error(err);
      }
    });

    tokenInstance.on('TransfersEnabled(uint256,string)', async (index, name) => {
      try {
        await db.Product.findOneAndUpdate({ collectionIndexInContract: index, contract }, { resaleEnabled: true });

        log.info(`RAIR: The transfer lock of collection ID#${ index }, name "${ name }" is removed.`);
      } catch (err) {
        log.error(err);
      }
    });
  };

  // Listeners
  const contractListeners = (provider) => {
    try {
      provider.on('NewContractDeployed(address,uint256,address)', async (user, length, contractAddress) => {
        try {
          const erc777Instance = new ethers.Contract(contractAddress, Token, binanceTestnetProvider);
          const title = await erc777Instance.name();

          await db.Contract.create({
            user,
            title,
            contractAddress: erc777Instance.address,
            blockchain: 'BNB'
          });

          log.info(`Factory: New Contract ${ contractAddress } of User ${ user } was stored to the DB.`);

          await setProductListeners(contractAddress);
        } catch (err) {
          log.error(err);
        }
      });

      // TODO: need to be clarify events below
      provider.on('TokensWithdrawn(address,address,uint256)', async (recipientAddress, token, amountOfTokens) => {
        log.info(`Factory: ERC777 token ${ token } received, total length ${ amountOfTokens } through deployments are sent to the owner ${ recipientAddress }.`);
      });

      provider.on('NewTokensAccepted(address,uint256)', async (token, amountOfTokens) => {
        log.info(`Factory: ERC777 token ${ token } is accepted as a deployment method from total amount of tokens ${ amountOfTokens }.`);
      });

      provider.on('TokenNoLongerAccepted(address)', async (token) => {
        log.info(`Factory: ERC777 token ${ token } is no longer accepted for deployments.`);
      });
    } catch (err) {
      log.error(err);
    }
  };

  const productListeners = async (provider, ownerAddress) => {
    try {
      const numberOfTokens = await provider.getContractCountOf(ownerAddress);
      const foundContracts = await db.Contract.find({ user: ownerAddress }).distinct('contractAddress');

      log.info(ownerAddress, 'has deployed', numberOfTokens.toString(), 'contracts');

      for (let j = 0; j < numberOfTokens; j++) {
        const contractAddress = await provider.ownerToContracts(ownerAddress, j);

        log.info(`Contract ${ contractAddress } found!`);

        if (!_.includes(foundContracts, contractAddress.toLowerCase())) {
          await db.Contract.create({
            user: ownerAddress,
            title: 'Some temporary title', // need to get from blockchain
            contractAddress,
            blockchain: 'BNB'
          });

          log.info(`Stored an additional Contract ${ contractAddress } for User ${ user }`);
        }

        await setProductListeners(contractAddress);
      }
    } catch (err) {
      log.error(err);
    }
  };

  const offerListeners = (provider) => {
    try {
      provider.on('AddedOffer(address,uint256,uint256,uint256)', async (contract, copies, price, catalogIndex) => {
        try {
          await db.Offer.create({
            marketplaceCatalogIndex: catalogIndex,
            contract,
            product: 200000000000000001,
            copies,
            price,
            resale: 0,
            range: [0, 15]
          });

          log.info(`Minter Marketplace: Created a new offer ${ catalogIndex } (from ${ contract }), ${ copies } tokens for ${ price } WEI each.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('UpdatedOffer(address,uint256,uint256,uint256)', async (contractAddress, copies, price, catalogIndex) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.Offer.findOneAndUpdate({ marketplaceCatalogIndex: catalogIndex, contract }, { copies, price });

          log.info(`Minter Marketplace: Update a offer ${ catalogIndex } (from ${ contract }), ${ copies } tokens for ${ price } WEI each.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('TokenMinted(address,uint256)', async (ownerAddress, catalogIndex) => {
        try {
          // TODO: contract address need to be in lowerCase
          const updatedOffer = await db.Offer.findOneAndUpdate({ marketplaceCatalogIndex: catalogIndex }, { $inc: { soldCopies: 1 } });

          // TODO: should be updated Product which offer belong to, field "soldCopies"
          // await db.Product.findOneAndUpdate({ collectionIndexInContract: updatedOffer.product, contract }, { $inc: { soldCopies: 1 } });

          await db.MintedToken.create({
            token: `temp_token_${ nanoid() }`, // FIXME: should received from event
            ownerAddress,
            offer: catalogIndex,
            contract: 'some contract', // FIXME: should received from event
          });

          log.info(`Minter Marketplace: Minted new token of the offer ${ catalogIndex } for User ${ ownerAddress }.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('SoldOut(address,uint256)', async (contractAddress, catalogIndex) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.Offer.findOneAndUpdate({
            marketplaceCatalogIndex: catalogIndex,
            contract
          }, { $set: { sold: true } });

          log.info(`Minter Marketplace: Offer ${ catalogIndex } runs out of allowed tokens.`);
        } catch (err) {
          log.error(err);
        }
      });

      // TODO: need to be clarify events below
      provider.on('ChangedTreasury(address)', async (newTreasuryAddress) => {
        log.info(`Minter Marketplace: Updates it’s treasury address ${ newTreasuryAddress }.`);
      });

      provider.on('ChangedTreasuryFee(address,uint16)', async (treasuryAddress, fee) => {
        log.info(`Minter Marketplace: The treasury ${ treasuryAddress } fee ${ fee } gets updated.`);
      });

      provider.on('ChangedNodeFee(uint16)', async (fee) => {
        log.info(`Minter Marketplace: Updates the node fee ${ fee }.`);
      });
    } catch (err) {
      log.error(err);
    }
  };

  return {
    contractListenersBNB: () => contractListeners(factoryInstanceBNB),
    productListenersBNB: (user) => productListeners(factoryInstanceBNB, user),
    offerListenersBNB: () => offerListeners(minterMarketplaceInstanceBNB),
    contractListenersETH: () => contractListeners(factoryInstanceETH),
    productListenersETH: (user) => productListeners(factoryInstanceETH, user),
    offerListenersETH: () => offerListeners(minterMarketplaceInstanceETH),
  };
};
