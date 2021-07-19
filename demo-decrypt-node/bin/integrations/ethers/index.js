const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Market = require('./contracts/Minter_Marketplace.json').abi;
const ERC777 = require('./contracts/RAIR777.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;

// Connect to the Binance Testnet
const binanceTestnetProvider = new ethers.providers.JsonRpcProvider(process.env.BINANCE_TESTNET, {
  chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
});

// These connections don't have an address associated, so they can read but can't write to the blockchain
const factoryInstance = new ethers.Contract(process.env.FACTORY_ADDRESS, Factory, binanceTestnetProvider);
const minterMarketplaceInstance = new ethers.Contract(process.env.MINTER_MARKETPLACE_ADDRESS, Market, binanceTestnetProvider);

const rairMintingInfo = async (ownerAddress) => {
  try {
    let listOfTokens = await factoryInstance.tokensByOwner(ownerAddress); // Put your wallet address here!

    for await (const token of listOfTokens) {
      let tokenInstance = new ethers.Contract(token, Token, binanceTestnetProvider);

      tokenInstance.on('CollectionCompleted(uint256)', (index) => {
        console.log(`The last token in collection ID#${ index } was minted`);
      });

      tokenInstance.on('CollectionCreated(uint256)', (index, name, number) => {
        console.log(`${ token } has a new collection: ID#${ index }`);
        console.log(`The number of tokens in new collection ID#${ index } is ${ number }`);
      });

      tokenInstance.on('TransfersEnabled(uint256)', (index) => {
        console.log(`The transfer lock of collection ID#${ index } is removed`);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const newContract = (db) => {
  try {
    factoryInstance.on('NewTokenDeployed(address, uint256, address)', async (ownerAddress, length, contractAddress) => {
      try {
        const erc777Instance = new ethers.Contract('contractAddress', ERC777, binanceTestnetProvider);

        const tokenName = await erc777Instance.name();

        const data = {
          user: ownerAddress,
          title: tokenName,
          contractAddress: erc777Instance.address,
        };

        await db.Contract.create(data);

        console.log(`New Contract ${ contractAddress } of User ${ ownerAddress } was stored to the DB.`);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const newMinterCollection = () => {
  try {
    minterMarketplaceInstance.on('AddedCollection(address)', async (token, index, price) => {
      `Minted new collection ${ token } with price of each token ${ price }.`;
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  newContract,
  newMinterCollection,
  rairMintingInfo
};
