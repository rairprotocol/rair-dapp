require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
require('dotenv').config()
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_API,
        blockNumber: 13000000,
        timeout: 1000000
      }
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ROPSTEN_ALCHEMY_URL}`,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_URL}`,
      accounts: [process.env.ADDRESS_PRIVATE_KEY],
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
      version: "0.8.7",
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
  mocha: {
    timeout: 0
  }
};