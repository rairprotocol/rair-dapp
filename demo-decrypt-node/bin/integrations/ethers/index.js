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
          copies
        });

        log.info(`RAIR: New Product ID#${ index } created for Contract ${ contract } with ${ copies } tokens`);
      } catch (err) {
        log.error(err);
      }
    });

    tokenInstance.on('CollectionCompleted(uint256,string)', async (index, name) => {
      try {
        await db.Product.findOneAndUpdate({ collectionIndexInContract: index, contract }, { sold: true });

        log.info(`RAIR: Product ID#${ index } with name "${ name }" ran out of mintable copies!`);
      } catch (err) {
        log.error(err);
      }
    });

    tokenInstance.on('RangeLocked(uint256,uint256,uint256,uint256,string)', async (product, startingToken, endingToken, lockedTokens, name) => {
      try {
        await db.LockedTokens.create({
          contract,
          product,
          range: [startingToken, endingToken],
          lockedTokens,
          isLocked: true
        });

        log.info(`RAIR: The range of tokens gets locked lock for Product ID#${ product }, name "${ name }", of Contract ${ contract }, for range from ${ startingToken } to ${ endingToken }, total number ${ lockedTokens }.`);
      } catch (err) {
        log.error(err);
      }
    });

    tokenInstance.on('RangeUnlocked(uint256,uint256,uint256)', async (product, startingToken, endingToken) => {
      try {
        await db.LockedTokens.findOneAndUpdate({
          contract,
          product
        }, { $set: { isLocked: false } });

        log.info(`RAIR: The range is unlocked for Product ID#${ product }, contract ${ contract }, for range from ${ startingToken } to ${ endingToken }.`);
      } catch (err) {
        log.error(err);
      }
    });
  };

  // Listeners
  const contractListeners = (provider) => {
    try {
      provider.on('NewContractDeployed(address,uint256,address)', async (userOwner, length, contractAddress) => {
        try {
          const user = userOwner.toLowerCase();
          const erc777Instance = new ethers.Contract(contractAddress, Token, binanceTestnetProvider);
          const title = await erc777Instance.name();
          const contract = erc777Instance.address.toLowerCase();

          await db.Contract.create({
            user,
            title,
            contractAddress: contract,
            blockchain: 'BNB'
          });

          log.info(`Factory: New Contract ${ contract } of User ${ user } was stored to the DB.`);

          await setProductListeners(contract);
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

      log.info(`${ ownerAddress } has deployed, ${ numberOfTokens.toString() }, contracts.`);

      for (let j = 0; j < numberOfTokens; j++) {
        const contractAddress = await provider.ownerToContracts(ownerAddress, j);
        const user = ownerAddress.toLowerCase();
        const contract = contractAddress.toLowerCase();

        log.info(`Contract ${ contractAddress } found!`);

        if (!_.includes(foundContracts, contract)) {
          await db.Contract.create({
            user,
            title: 'Some temporary title', // need to get from blockchain
            contractAddress: contract,
            blockchain: 'BNB'
          });

          log.info(`Stored an additional Contract ${ contract } for User ${ user }`);
        }

        await setProductListeners(contract);

        if (j === (numberOfTokens - 1)) log.info(`Contract search complete!`);
      }
    } catch (err) {
      log.error(err);
    }
  };

  const offerListeners = (provider) => {
    try {
      provider.on('AddedOffer(address,uint256,uint256,uint256)', async (contractAddress, product, rangeNumber, catalogIndex) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.OfferPool.create({
            marketplaceCatalogIndex: catalogIndex,
            contract,
            product,
            rangeNumber
          });

          log.info(`Minter Marketplace: Created a new offerPool ${ catalogIndex } (from ${ contract }), Product ID#${ product }.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('AppendedRange(address,uint256,uint256,uint256,uint256,uint256,uint256,string)', async (contractAddress, product, offerPool, rangeIndex, startingToken, endingToken, price, rangeName) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.Offer.create({
            rangeIndex,
            contract,
            product,
            offerPool,
            price,
            range: [startingToken, endingToken],
            rangeName
          });

          log.info(`Minter Marketplace: Created new Offer ${ rangeIndex }, name ${ rangeName } (from Contract ${ contract }, Product ${ product }), offerPool ${ offerPool }, range from ${ startingToken } to ${ endingToken } by price ${ price } WEI each.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('UpdatedOffer(address,uint256,uint256,uint256,uint256,string)', async (contractAddress, offerPool, rangeIndex, copies, price, rangeName) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.Offer.findOneAndUpdate({ offerPool, contract, rangeIndex }, { copies, price, rangeName });

          log.info(`Minter Marketplace: Update a Offer ${ rangeIndex }, in offerPool ${ offerPool }, name ${ rangeName } (from ${ contract }), new amount of tokens ${ copies } by ${ price } WEI each.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('TokenMinted(address,address,uint256,uint256,uint256)', async (ownerAddress, contractAddress, offerPool, range, tokenIndex) => {
        try {
          const contract = contractAddress.toLowerCase();

          await db.MintedToken.create({
            token: tokenIndex,
            ownerAddress,
            offerPool,
            range,
            contract,
          });

          const updatedOffer = await db.Offer.findOneAndUpdate({
            rangeIndex: range,
            offerPool
          }, { $inc: { soldCopies: 1 } });

          await db.Product.findOneAndUpdate({
            collectionIndexInContract: updatedOffer.product,
            contract
          }, { $inc: { soldCopies: 1 } });

          log.info(`Minter Marketplace: Minted new token ${ tokenIndex } of the offer ${ range } in offerPool ${ offerPool } for User ${ ownerAddress }.`);
        } catch (err) {
          log.error(err);
        }
      });

      provider.on('SoldOut(address,uint256,uint256)', async (contractAddress, offerPool, rangeIndex) => {
        try {
          const contract = contractAddress.toLowerCase();

          const offer = await db.Offer.findOneAndUpdate({ rangeIndex, offerPool }, { $set: { sold: true } });

          const product = await db.Product.findOne({ collectionIndexInContract: offer.product, contract });

          log.info(`Minter Marketplace: Offer ${ rangeIndex } from Product ${ product.name } runs out of allowed tokens.`);
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
