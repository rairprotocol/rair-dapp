const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Market = require('./contracts/Minter_Marketplace.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;

// Connect to the Binance Testnet
const binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
  chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
});

const factoryInstance = await new ethers.Contract('0x4d4b5a70E77ac749B180eC24e48d03aF9d08e531', Factory, binanceTestnetProvider);
const minterMarketplaceInstance = await new ethers.Contract('0x4d4b5a70E77ac749B180eC24e48d03aF9d08e532', Market, binanceTestnetProvider);

async function collectionInfo (contractAddress, ownerAddress) {
  // These connections don't have an address associated, so they can read but can't write to the blockchain
  let listOfTokens = await factoryInstance.tokensByOwner(ownerAddress); // Put your wallet address here!

  for await (const token of listOfTokens) {
    let tokenInstance = new ethers.Contract(token, Token, binanceTestnetProvider);

    tokenInstance.on("CollectionCompleted(uint256)", (index) => {
      console.log(`The last token in collection ID#${index} was minted`);
    });

    tokenInstance.on("CollectionCreated(uint256)", (index, name, number) => {
      console.log(`${token} has a new collection: ID#${index}`);
      console.log(`The number of tokens in new collection ID#${index} is ${number}`);
    });

    tokenInstance.on("TransfersEnabled(uint256)", (index) => {
      console.log(`The transfer lock of collection ID#${index} is removed`);
    });
  }
}

module.exports = {
  collectionInfo
}
