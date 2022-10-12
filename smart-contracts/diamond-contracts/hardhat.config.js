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
				url: process.env.ETH_MAIN_RPC,
				blockNumber: 13000000,
			}
		},
		"0x1": {
			url: process.env.ETH_MAIN_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x5": {
			url: process.env.GOERLI_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x13881": {
			url: process.env.MUMBAI_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x89": {
			url: process.env.MATIC_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x61": {
			url: process.env.BSC_TEST_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
		},
		"0x38": {
			url: process.env.BSC_MAIN_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
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
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_API_KEY,
			goerli: process.env.ETHERSCAN_API_KEY,

			polygon: process.env.POLYGONSCAN_API_KEY,
			polygonMumbai: process.env.POLYGONSCAN_API_KEY,

			bsc: process.env.BSCSCAN_API_KEY,
			bscTestnet: process.env.BSCSCAN_API_KEY,
		}
	}
};