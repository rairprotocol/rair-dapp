require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require("hardhat-tracer");
require('dotenv').config()
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETHEREUM_ARCHIVE_SPEEDY_NODE,
        blockNumber: 13000000,
        timeout: 1000000
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
    }],
  },
  gasReporter: {
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
    //apiKey: process.env.POLYGONSCAN_API_KEY
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};