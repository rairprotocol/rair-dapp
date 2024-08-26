import { Contract, providers } from 'ethers';

import { ContractsActionsType, ContractsInitialType } from './contracts.types';
import * as types from './types';

import {
  diamondFactoryAbi,
  diamondMarketplaceAbi,
  erc777Abi,
  factoryAbi,
  licenseExchangeABI,
  minterAbi
} from '../../contracts';

const InitialState: ContractsInitialType = {
  minterInstance: undefined,
  factoryInstance: undefined,
  mainTokenInstance: undefined,
  diamondFactoryInstance: undefined,
  diamondMarketplaceInstance: undefined,
  licenseExchangeInstance: undefined,
  currentChain: import.meta.env.VITE_DEFAULT_BLOCKCHAIN as BlockchainType,
  currentUserAddress: undefined,
  programmaticProvider: undefined,
  contractCreator: undefined,
  realChain: undefined,
  coingeckoRates: undefined
};

export default function userStore(
  state: ContractsInitialType = InitialState,
  action: ContractsActionsType
): ContractsInitialType {
  switch (action.type) {
    case types.SET_CHAIN_ID:
      // eslint-disable-next-line
      const addresses = action.blockchainSettings?.find(
        (chain) => chain.hash === action.currentChain
      );
      if (action.currentChain !== undefined && addresses !== undefined) {
        let signer;
        if (state.programmaticProvider) {
          signer = state.programmaticProvider;
        } else if (window.ethereum) {
          const provider = new providers.Web3Provider(window.ethereum, 'any');
          provider.on(
            'debug',
            ({
              // action,
              request,
              response
              // provider
            }) => {
              if (import.meta.env.VITE_LOG_WEB3 === 'true') {
                console.info(
                  response ? 'Receiving response to' : 'Sending request',
                  request.method
                );
              }
            }
          );
          provider.on('network', (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            /*
							Example of a network object:
							{
							    "name": "goerli",
							    "chainId": 5,
							    "ensAddress": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
							}
						*/
            if (oldNetwork) {
              console.info(
                `Detected a network change, from ${oldNetwork.name} to ${newNetwork.name}`
              );
            } else {
              console.info(`Connected to ${newNetwork.name}`);
            }
          });
          signer = provider.getSigner(0);
        } else {
          return {
            ...state,
            currentChain: action.currentChain,
            web3Provider: undefined,
            minterInstance: undefined,
            factoryInstance: undefined,
            mainTokenInstance: undefined,
            contractCreator: undefined,
            diamondFactoryInstance: undefined,
            diamondMarketplaceInstance: undefined,
            licenseExchangeInstance: undefined
          };
        }
        const contractCreator = (address, abi) => {
          if (address) {
            return new Contract(address, abi, signer);
          }
          return undefined;
        };

        return {
          ...state,
          currentChain: action.currentChain,
          factoryInstance: contractCreator(
            addresses.classicFactoryAddress,
            factoryAbi
          ),
          minterInstance: contractCreator(
            undefined, //addresses.classicMarketplaceAddress,
            minterAbi
          ),
          mainTokenInstance: contractCreator(
            addresses.mainTokenAddress,
            erc777Abi
          ),
          diamondFactoryInstance: contractCreator(
            addresses.diamondFactoryAddress,
            diamondFactoryAbi
          ),
          diamondMarketplaceInstance: contractCreator(
            addresses.diamondMarketplaceAddress,
            diamondMarketplaceAbi
          ),
          licenseExchangeInstance: contractCreator(
            addresses.licenseExchangeAddress,
            licenseExchangeABI
          ),
          contractCreator: contractCreator
        };
      } else {
        return {
          ...state,
          currentChain: action.currentChain,
          minterInstance: undefined,
          factoryInstance: undefined,
          mainTokenInstance: undefined,
          contractCreator: undefined,
          diamondFactoryInstance: undefined,
          diamondMarketplaceInstance: undefined
        };
      }
    case types.SET_USER_ADDRESS:
      // eslint-disable-next-line no-case-declarations
      const update = {
        ...state,
        currentUserAddress: action.currentUserAddress
      };
      if (action.currentUserAddress === undefined) {
        update.currentChain = import.meta.env
          .VITE_DEFAULT_BLOCKCHAIN as BlockchainType;
      }
      return update;
    case types.SET_PROGRAMMATIC_PROVIDER:
      return {
        ...state,
        programmaticProvider: action.programmaticProvider
      };
    case types.SET_REAL_CHAIN:
      return {
        ...state,
        realChain: action.realChain
      };
    case types.SET_COINGECKO_RATE:
      return {
        ...state,
        coingeckoRates: action.rates
      };
    default:
      return state;
  }
}
