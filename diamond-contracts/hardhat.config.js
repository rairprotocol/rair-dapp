require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-deploy');
require('hardhat-contract-sizer');
require("hardhat-gas-reporter");
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
		}
	},
	solidity: {
		compilers: [{
			version: "0.8.11",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		}],
	},
	contractSizer: {
		runOnCompile: true,
		strict: true
	},
	mocha: {
		timeout: 0
	},
	gasReporter: {
		currency: 'USD',
		showTimeSpent: true,
		coinmarketcap: process.env.COINMARKETCAP || undefined
	}
};