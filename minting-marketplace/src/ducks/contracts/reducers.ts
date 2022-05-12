//@ts-nocheck
import * as types from './types';

import * as ethers from 'ethers'

import {minterAbi, factoryAbi, erc777Abi} from '../../contracts';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0x91429c87b1D85B0bDea7df6F71C854aBeaD99EE4',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0x3a61f5bF7D205AdBd9c0beE91709482AcBEE089f'
	},
	'0x5': { // Ethereum Goerli
		factory: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba'
	},
	'0x13881': { // Matic Mumbai
		factory: '0x1A5bf89208Dddd09614919eE31EA6E40D42493CD',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0x63Dd6821D902012B664dD80140C54A98CeE97068'
	}
}

const InitialState = {
	minterInstance: undefined,
	factoryInstance: undefined,
	erc777Instance: undefined,
	currentChain: undefined,
	currentUserAddress: undefined,
	programmaticProvider: undefined,
	realChain: undefined
};

export default function userStore(state = InitialState, action) {
	switch (action.type) {
		case types.SET_CHAIN_ID:
			if (window.ethereum && contractAddresses[action.payload] !== undefined) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				let signer = provider.getSigner(0);
				return {
					...state,
					currentChain: action.payload,
					factoryInstance: new ethers.Contract(
						contractAddresses[action.payload].factory,
						factoryAbi,
						signer),
					minterInstance: new ethers.Contract(
						contractAddresses[action.payload].minterMarketplace,
						minterAbi,
						signer),
					erc777Instance: new ethers.Contract(
						contractAddresses[action.payload].erc777,
						erc777Abi,
						signer)
				};
			} else if (state.programmaticProvider) {
				return {
					...state,
					currentUserAddress: state.programmaticProvider.address,
					currentChain: action.payload,
					factoryInstance: new ethers.Contract(
						contractAddresses[action.payload].factory,
						factoryAbi,
						state.programmaticProvider),
					minterInstance: new ethers.Contract(
						contractAddresses[action.payload].minterMarketplace,
						minterAbi,
						state.programmaticProvider),
					erc777Instance: new ethers.Contract(
						contractAddresses[action.payload].erc777,
						erc777Abi,
						state.programmaticProvider)
				};
			} else {
				return {...state};
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
		case types.SET_REAL_CHAIN:
			return {
				...state,
				realChain: action.payload
			}
		default:
			return state;
	}
}
