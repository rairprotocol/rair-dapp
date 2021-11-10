import * as types from './types';

import * as ethers from 'ethers'

import {minterAbi, factoryAbi, erc777Abi} from '../../contracts';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0x122D66159CBe0F9021aC120923847E79a4dCFC2C',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0x67C6c13F75F0016403BEaaE10C1afCE142C16974'
	},
	'0x5': { // Ethereum Goerli
		factory: '0x0C7A7D9641AB33228fD9C202DB4290B304963592',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5'
	},
	'0x13881': { // Matic Mumbai
		factory: '0x5535FE9ABdA206F6780cc87b4e1fe4733b98bd9C',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0xA754e609F85E5b30285bf0F897a0Bc0368c41c81'
	},
	'0x89': {
		factory: '0x92FBe344513e108B581170E73CFA352B729E47EA',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0xA2A7e7636AB4374847074c147BE770624F43342E'
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
