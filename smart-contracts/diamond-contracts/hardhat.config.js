require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
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
				blockNumber: 19600000
			}
		},
		"0x1": {
			url: process.env.ETH_MAIN_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x89": {
			url: process.env.MATIC_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x250": {
			url: process.env.ASTAR_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0xaa36a7": {
			url: process.env.SEPOLIA_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
		},
		"0x13882": {
			url: process.env.AMOY_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
		},
		"0x2105": {
			url: process.env.BASE_RPC,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
		}
	},
	solidity: {
		compilers: [{
			version: "0.8.25",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		},{
			version: "0.8.19",
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
	sourcify: {
		enabled: false,
	},
	mocha: {
		timeout: 0
	},
	gasReporter: {
		currency: 'USD',
		showTimeSpent: true,
		coinmarketcap: process.env.COINMARKETCAP_API_KEY || undefined
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHERSCAN_API_KEY,
			sepolia: process.env.ETHERSCAN_API_KEY,

			polygon: process.env.POLYGONSCAN_API_KEY,
			polygonAmoy: process.env.OKLINK_API_KEY,

			base: process.env.BASESCAN_API_KEY,
			astar: process.env.BLOCKSCOUT_API_KEY,
		},
		customChains: [
			{
				network: "astar",
				chainId: 592,
				urls: {
					apiURL: "https://astar.blockscout.com/api/",
					browserURL: "https://astar.blockscout.com/"
				}
			},
			{
				network: "polygonAmoy",
				chainId: 80002,
				urls: {
					apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
					browserURL: "https://www.oklink.com/polygonAmoy"
				},
			},
			{
				network: "base",
				chainId: 80002,
				urls: {
					apiURL: "https://api.basescan.org/api",
					browserURL: "https://basescan.org/"
				},
			}
		],
		
	}
};