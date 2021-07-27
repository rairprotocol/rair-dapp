const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Market = require('./contracts/Minter_Marketplace.json').abi;
const ERC777 = require('./contracts/RAIR777.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;

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

  const setProductListeners = async (contractAddress) => {
    const tokenInstance = new ethers.Contract(contractAddress, Token, binanceTestnetProvider);

    // tokenInstance.on('CollectionCompleted(uint256)', (index) => {
    //   console.log(`The last token in collection ID#${ index } was minted in BNB`);
    // });

    tokenInstance.on('CollectionCreated(uint256,string,uint256)', async (index, name, copies) => {
      await db.Product.create({
        name,
        collectionIndexInContract: index,
        contract: contractAddress,
        copies
      });

      console.log(`New Product ID#${ index } created for Contract  ${ contractAddress } with ${ copies } tokens`);
    });

    // tokenInstance.on('TransfersEnabled(uint256)', (index) => {
    //   console.log(`The transfer lock of collection ID#${ index } is removed in BNB`);
    // });
  };

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

          console.log(`New BNB Contract ${ contractAddress } of User ${ user } was stored to the DB.`);

          await setProductListeners(contractAddress);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const productListeners = async (provider, ownerAddress) => {
    try {
      const numberOfTokens = await provider.getContractCountOf(ownerAddress);

      console.log(ownerAddress, 'has deployed', numberOfTokens.toString(), 'contracts');

      for (let j = 0; j < numberOfTokens; j++) {
        const contractAddress = await provider.ownerToContracts(ownerAddress, j);

        console.log(`Contract ${ contractAddress } found!`);

        await setProductListeners(contractAddress);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const offerListeners = (provider) => {
    try {
      provider.on('AddedOffer(address,uint256,uint256,uint256)', async (contract, copies, price, catalogIndex) => {
        await db.Offer.create({
          marketplaceCatalogIndex: catalogIndex,
          contract,
          product: 2,
          copies,
          price,
        });

        console.log(`Minter Marketplace: Created a new offer ${catalogIndex} (from ${contract}), ${copies} tokens for ${price} WEI each.`);
      });

      provider.on('UpdatedOffer(address,uint256,uint256,uint256)', async (contract, copies, price, catalogIndex) => {
        await db.Offer.findOneAndUpdate({ marketplaceCatalogIndex: catalogIndex, contract }, { copies, price });

        console.log(`Minter Marketplace: Update a offer ${catalogIndex} (from ${contract}), ${copies} tokens for ${price} WEI each.`);
      });

      provider.on('TokenMinted(address,uint256)', async (ownerAddress, catalogIndex) => {
        const updatedOffer = await db.Offer.findOneAndUpdate({ marketplaceCatalogIndex: catalogIndex }, { $inc: { soldCopies: 1 } });

        // TODO: should be updated Product which offer belong to, field "soldCopies"
        // await db.Product.findOneAndUpdate({ collectionIndexInContract: updatedOffer.product }, { $inc: { soldCopies: 1 } });

        console.log(`Minter Marketplace: Minted new token of the offer ${catalogIndex} for User ${ ownerAddress }.`);
      });


      // TODO: need to be clarify
      provider.on('SoldOut(address,uint256)', async (contract, catalogIndex) => {
        const updatedOffer = await db.Offer.findOneAndUpdate({ marketplaceCatalogIndex: catalogIndex, contract }, { $set: { outOfAllowedTokens: true } });

        console.log(`Minter Marketplace: Offer ${catalogIndex} runs out of allowed tokens.`);
      });

      provider.on('ChangedTreasury(address)', async (newTreasuryAddress) => {

        console.log(`Minter Marketplace: Updates it’s treasury address ${ newTreasuryAddress }.`);
      });

      provider.on('ChangedTreasuryFee(address,uint16)', async (treasuryAddress, fee) => {

        console.log(`Minter Marketplace: The treasury ${ treasuryAddress } fee ${ fee } gets updated.`);
      });

      provider.on('ChangedNodeFee(uint16)', async (fee) => {

        console.log(`Minter Marketplace: Updates the node fee ${ fee }.`);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    contractListenersBNB: () => contractListeners(factoryInstanceBNB),
    productListenersBNB: (user) => productListeners(factoryInstanceBNB, user),
    offerListenersBNB: () => offerListeners(minterMarketplaceInstanceBNB),
    contractListenersETH: () => contractListeners(factoryInstanceETH),
    productListenersETH: (user) => productListeners(factoryInstanceETH, user),
    offerListenersETH: () => offerListeners(minterMarketplaceInstanceETH),
  }
}
