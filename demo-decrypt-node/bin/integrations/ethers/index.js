const ethers = require('ethers');
const Factory = require('./contracts/RAIR_Token_Factory.json').abi;
const Market = require('./contracts/Minter_Marketplace.json').abi;
const ERC777 = require('./contracts/RAIR777.json').abi;
const Token = require('./contracts/RAIR_ERC721.json').abi;

// Connect to the Binance Testnet
const binanceTestnetProvider = new ethers.providers.JsonRpcProvider(process.env.BINANCE_TESTNET, {
  chainId: 97, symbol: 'BNB', name: 'Binance Testnet'
});

const infuraTestnetProvider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_PROJECT_ID);

// These connections don't have an address associated, so they can read but can't write to the blockchain
// BNB
const factoryInstanceBNB = new ethers.Contract(process.env.FACTORY_ADDRESS, Factory, binanceTestnetProvider);
const minterMarketplaceInstanceBNB = new ethers.Contract(process.env.MINTER_MARKETPLACE_ADDRESS, Market, binanceTestnetProvider);

// Ethereum
const factoryInstanceETH = new ethers.Contract(process.env.FACTORY_ADDRESS, Factory, infuraTestnetProvider);
const minterMarketplaceInstanceETH = new ethers.Contract(process.env.MINTER_MARKETPLACE_ADDRESS, Market, infuraTestnetProvider);

const rairMintingInfoBNB = async (db, ownerAddress) => {
  try {
    let listOfTokens = await factoryInstanceBNB.tokensByOwner(ownerAddress); // Put your wallet address here!

    for await (const token of listOfTokens) {
      let tokenInstance = new ethers.Contract(token, Token, binanceTestnetProvider);

      tokenInstance.on('CollectionCompleted(uint256)', (index) => {
        console.log(`The last token in collection ID#${ index } was minted in BNB`);
      });

      tokenInstance.on('CollectionCreated(uint256)', (index, name, number) => {
        console.log(`${ token } has a new collection: ID#${ index } in BNB`);
        console.log(`The number of tokens in new collection ID#${ index } is ${ number } in BNB`);
      });

      tokenInstance.on('TransfersEnabled(uint256)', (index) => {
        console.log(`The transfer lock of collection ID#${ index } is removed in BNB`);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const newContractBNB = (db) => {
  try {
    factoryInstanceBNB.on('NewTokenDeployed(address, uint256, address)', async (ownerAddress, length, contractAddress) => {
      try {
        const erc777Instance = new ethers.Contract('contractAddress', ERC777, binanceTestnetProvider);

        const tokenName = await erc777Instance.name();

        const data = {
          user: ownerAddress,
          title: tokenName,
          contractAddress: erc777Instance.address,
          blockchain: 'BNB'
        };

        await db.Contract.create(data);

        console.log(`New BNB Contract ${ contractAddress } of User ${ ownerAddress } was stored to the DB.`);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const newMinterCollectionBNB = (db) => {
  try {
    minterMarketplaceInstanceBNB.on('AddedCollection(address)', async (token, index, price) => {
      `Minted new collection ${ token } in BNB with price of each token ${ price }.`;
    });
  } catch (err) {
    console.log(err);
  }
};

const rairMintingInfoETH = async (db, ownerAddress) => {
  try {
    let listOfTokens = await factoryInstanceETH.tokensByOwner(ownerAddress); // Put your wallet address here!

    for await (const token of listOfTokens) {
      let tokenInstance = new ethers.Contract(token, Token, infuraTestnetProvider);

      tokenInstance.on('CollectionCompleted(uint256)', (index) => {
        console.log(`The last token in collection ID#${ index } was minted in ETH`);
      });

      tokenInstance.on('CollectionCreated(uint256)', (index, name, number) => {
        console.log(`${ token } has a new collection: ID#${ index } in ETH`);
        console.log(`The number of tokens in new collection ID#${ index } is ${ number } in ETH`);
      });

      tokenInstance.on('TransfersEnabled(uint256)', (index) => {
        console.log(`The transfer lock of collection ID#${ index } is removed in ETH`);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const newContractETH = (db) => {
  try {
    factoryInstanceETH.on('NewTokenDeployed(address, uint256, address)', async (ownerAddress, length, contractAddress) => {
      try {
        const erc777Instance = new ethers.Contract('contractAddress', ERC777, infuraTestnetProvider);

        const tokenName = await erc777Instance.name();

        const data = {
          user: ownerAddress,
          title: tokenName,
          contractAddress: erc777Instance.address,
          blockchain: 'ETH'
        };

        await db.Contract.create(data);

        console.log(`New Ethereum Contract ${ contractAddress } of User ${ ownerAddress } was stored to the DB.`);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const newMinterCollectionETH = (db) => {
  try {
    minterMarketplaceInstanceETH.on('AddedCollection(address)', async (token, index, price) => {
      `Minted new collection ${ token } in Ethereum with price of each token ${ price }.`;
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  newContractBNB,
  newMinterCollectionBNB,
  rairMintingInfoBNB,
  newContractETH,
  newMinterCollectionETH,
  rairMintingInfoETH
};
