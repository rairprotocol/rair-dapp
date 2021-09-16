import * as types from './types';

import * as ethers from 'ethers'

import {minterAbi, factoryAbi, erc777Abi} from '../../contracts';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0x8CFB64bd8295372e532D7595cEf0b900c768e612',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0x1150A9D87EAb450ab83A3779Fe977cfdF9aEF45C'
	},
	'0x5': { // Ethereum Goerli
		factory: '0x69F0980e45ae2A3aC5254C7B3202E8fce5B0f84F',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0xb256E35Ad58fc9c57948388C27840CEBcd7cb991'
	},
	'0x13881': { // Matic Mumbai
		factory: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba'
	}
}

const InitialState = {
	minterInstance: undefined,
	factoryInstance: undefined,
	erc777Instance: undefined,
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
					signer = provider.getSigner(0);
				} else if (state.programmaticProvider) {
					signer = state.programmaticProvider;
				} else {
					return {
						...state,
						currentChain: action.payload,
						minterInstance: undefined,
						factoryInstance: undefined,
						erc777Instance: undefined,
						contractCreator: undefined
					} 
				}
				const contractCreator = (address, abi) => {
					return new ethers.Contract(address, abi, signer);
				}
				return {
					...state,
					currentChain: action.payload,
					factoryInstance: contractCreator(contractAddresses[action.payload].factory, factoryAbi),
					minterInstance: contractCreator(contractAddresses[action.payload].minterMarketplace, minterAbi),		
					erc777Instance: contractCreator(contractAddresses[action.payload].erc777, erc777Abi),
					contractCreator: contractCreator
				}
			} else {
				return {
					...state,
					currentChain: action.payload,
					minterInstance: undefined,
					factoryInstance: undefined,
					erc777Instance: undefined,
					contractCreator: undefined
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
