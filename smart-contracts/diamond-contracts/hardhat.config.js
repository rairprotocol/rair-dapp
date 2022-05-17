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
		},
		"0x5": {
			url: process.env.GOERLI_SPEEDY_NODE,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x13881": {
			url: process.env.MUMBAI_SPEEDY_NODE,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x89": {
			url: process.env.MATIC_SPEEDY_NODE,
			accounts: [process.env.ADDRESS_PRIVATE_KEY],
		},
		"0x61": {
			url: process.env.BINANCE_TESTNET_SPEEDY_NODE,
			accounts: [process.env.ADDRESS_PRIVATE_KEY]
		},
		"0x38": {
			url: process.env.BINANCE_MAINNET_SPEEDY_NODE,
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
			version: "0.8.13",
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
		/*{
			mainnet: process.env.ETHERSCAN_API_KEY,
			ropsten: process.env.ETHERSCAN_API_KEY,
			rinkeby: process.env.ETHERSCAN_API_KEY,
			kovan: process.env.ETHERSCAN_API_KEY,
			// huobi eco chain
			heco: "YOUR_HECOINFO_API_KEY",
			hecoTestnet: "YOUR_HECOINFO_API_KEY",
			// fantom mainnet
			opera: "YOUR_FTMSCAN_API_KEY",
			ftmTestnet: "YOUR_FTMSCAN_API_KEY",
			// optimistim
			optimisticEthereum: "YOUR_OPTIMISTIC_ETHERSCAN_API_KEY",
			optimisticKovan: "YOUR_OPTIMISTIC_ETHERSCAN_API_KEY",
			// polygon
			polygon: process.env.POLYGONSCAN_API_KEY,
			polygonMumbai: process.env.POLYGONSCAN_API_KEY,
			// arbitrum
			arbitrumOne: "YOUR_ARBISCAN_API_KEY",
			arbitrumTestnet: "YOUR_ARBISCAN_API_KEY",
			// avalanche
			avalanche: "YOUR_SNOWTRACE_API_KEY",
			avalancheFujiTestnet: "YOUR_SNOWTRACE_API_KEY",
			// moonriver
			moonriver: "YOUR_MOONRIVER_MOONSCAN_API_KEY",
			moonbaseAlpha: "YOUR_MOONRIVER_MOONSCAN_API_KEY",
			// xdai and sokol don't need an API key, but you still need
			// to specify one; any string placeholder will work
			xdai: "api-key",
			sokol: "api-key",
		}*/
	}
};