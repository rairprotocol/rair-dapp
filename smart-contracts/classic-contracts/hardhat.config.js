require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require("hardhat-tracer");
require("@nomicfoundation/hardhat-toolbox");
// Disabled because there's no use for Types
//require('@typechain/hardhat');
require('dotenv').config()
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETHEREUM_ARCHIVE_SPEEDY_NODE,
        blockNumber: 14000000,
      }
    },
    ethMainnet: {
      url: process.env.ETHEREUM_ARCHIVE_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
    },
    matic: {
      url: process.env.MATIC_MAINNET_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY]
    },
    binanceTestnet: {
      url: process.env.BINANCE_TESTNET_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY]
    },
    binanceMainnet: {
      url: process.env.BINANCE_MAINNET_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY]
    }
  },
  solidity: {
    compilers: [{
      version: "0.8.10",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },{
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }],
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    showTimeSpent: true,
    coinmarketcap: process.env.COINMARKETCAP || undefined
  },
  contractSizer: {
    runOnCompile: true,
    strict: true
  },
  mocha: {
    timeout: 0
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
    }
  }
};