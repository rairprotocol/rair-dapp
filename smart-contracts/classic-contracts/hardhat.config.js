require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('@openzeppelin/hardhat-upgrades');
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
        url: process.env.GOERLI_SPEEDY_NODE,
        blockNumber: 13000000,
        timeout: 1000000
      }
    },
    ethMainnet: {
      url: process.env.GOERLI_SPEEDY_NODE,
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
      url: process.env.GOERLI_SPEEDY_NODE,
      accounts: [process.env.ADDRESS_PRIVATE_KEY]
    },
    binanceSmartchain: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
      timeout: 0
    }
  },
  solidity: {
    compilers: [{
      version: "0.8.9",
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
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};