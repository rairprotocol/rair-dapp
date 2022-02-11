import * as types from './types';

import * as ethers from 'ethers'

import {minterAbi, factoryAbi, erc777Abi, diamondFactoryAbi, diamondMarketplaceAbi} from '../../contracts';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0xb173E2F7eD8Bb697e70b02Ed38faaa2319dB3C23',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD',
		diamondFactory: undefined,
		diamondMarketplace: undefined
	},
	'0x5': { // Ethereum Goerli
		factory: '0xF9DC1787179c1404910adE194A5087cEbD5c4717',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5',
		diamondFactory: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0xEF85370b8F136E2F28eA904bF0dA5acac3D1d74f',
		diamondMarketplace: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0x6B3c06b39Aa1ADe73c625b184326d4837c7a2b64'
	},
	'0x13881': { // Matic Mumbai
		factory: '0xB8083810Fa33e7Ebd777c8cd6eBB453948aFd354',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0x4594D508cDa05D016571082d467889f4629e1f56',
		diamondFactory: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0xbB236Ce48dDCb58adB8665E220FE976bA5d080a5',
		diamondMarketplace: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0x2c8BA9f098CD319a971cE2705F26723c81044Cb0'
	},
	'0x89': {
		factory: '0x9bB24e68d952Ab872b0421297E0cda8D89B2390B',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0x781F15a23506CF28539EA057e3f33008E6339E49',
		diamondFactory: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0x9498b23e964760364435C23c793e9352Ff4E2200',
		diamondMarketplace: process.env.REACT_APP_DIAMONDS_ENABLED === 'true' && '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1'
	},
	'0x1': {
		factory: '0xC9eF9902fa24923A17326aDdb7da0E67fF46692a',
		erc777: '0xf0ebe73fdae61b305132fd1873c98fb5c4735b40',
		minterMarketplace: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		diamondFactory: undefined,
		diamondMarketplace: undefined
	}
}

const InitialState = {
	minterInstance: undefined,
	factoryInstance: undefined,
	erc777Instance: undefined,
	diamondFactoryInstance: undefined,
	diamondMarketplaceInstance: undefined,
	currentChain: undefined,
	currentUserAddress: undefined,
	programmaticProvider: undefined,
	contractCreator: undefined
};

export default function userStore(state = InitialState, action) {
	switch (action.type) {
		case types.SET_CHAIN_ID:
			if (contractAddresses[action.payload] !== undefined) {
				let signer;
				if (window.ethereum) {
					let provider = new ethers.providers.Web3Provider(window.ethereum);
					provider.on('debug', ({action, request, response, provider}) => {
						if (process.env.REACT_APP_LOG_WEB3 === 'true') {
							console.log(response ? 'Receiving response to' : 'Sending request', request.method);
						}
					})
					signer = provider.getSigner(0);
				} else if (state.programmaticProvider) {
					signer = state.programmaticProvider;
				} else {
					return {
						...state,
						currentChain: action.payload,
						web3Provider: undefined,
						minterInstance: undefined,
						factoryInstance: undefined,
						erc777Instance: undefined,
						contractCreator: undefined,
						diamondFactoryInstance: undefined,
						diamondMarketplaceInstance: undefined,
					} 
				}
				const contractCreator = (address, abi) => {
					if (address) {
						return new ethers.Contract(address, abi, signer);
					}
					return undefined;
				}
				return {
					...state,
					currentChain: action.payload,
					factoryInstance: contractCreator(contractAddresses[action.payload].factory, factoryAbi),
					minterInstance: contractCreator(contractAddresses[action.payload].minterMarketplace, minterAbi),		
					erc777Instance: contractCreator(contractAddresses[action.payload].erc777, erc777Abi),
					diamondFactoryInstance: contractCreator(contractAddresses[action.payload].diamondFactory, diamondFactoryAbi),
					diamondMarketplaceInstance: contractCreator(contractAddresses[action.payload].diamondMarketplace, diamondMarketplaceAbi),
					contractCreator: contractCreator
				}
			} else {
				return {
					...state,
					currentChain: action.payload,
					minterInstance: undefined,
					factoryInstance: undefined,
					erc777Instance: undefined,
					contractCreator: undefined,
					diamondFactoryInstance: undefined,
					diamondMarketplaceInstance: undefined,
				}
			}
		case types.SET_USER_ADDRESS:
			return {
				...state,
				currentUserAddress: action.payload
			};
		case types.SET_PROGRAMMATIC_PROVIDER:
			return {
				...state,
				programmaticProvider: action.payload
			};
		default:
			return state;
	}
}
