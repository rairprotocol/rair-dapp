import { Contract, providers } from 'ethers';

import {
  ContractAddressesType,
  ContractsActionsType,
  ContractsInitialType
} from './contracts.types';
import * as types from './types';

import {
  creditHandlerAbi,
  diamondFactoryAbi,
  diamondMarketplaceAbi,
  erc777Abi,
  factoryAbi,
  licenseExchangeABI,
  minterAbi,
  resaleAbi,
  tokenPurchaserAbi
} from '../../contracts';

const contractAddresses: ContractAddressesType = {
  // '0x38': {
  //   // Binance Mainnet
  //   factory: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
  //   erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
  //   minterMarketplace: '0xC9eF9902fa24923A17326aDdb7da0E67fF46692a',
  //   diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0x556a3Db6d800AAA56f8B09E476793c5100705Db5') as string,
  //   diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0x92FBe344513e108B581170E73CFA352B729E47EA') as string,
  //   resaleMarketplace: undefined,
  //   tokenPurchaser: undefined,
  //   creditHandler: undefined
  // },
  // '0x61': {
  //   // Binance Testnet
  //   factory: '0xfaB4B835fBFC671c15e2fDe237c625e82612893F',
  //   erc777: '0x5b01aBE2DCfaa4C9c80ccE87223c8e21D7Fc9845',
  //   minterMarketplace: '0xcBA6014452e82eBF98fA2748BBD46f1733a13AdD',
  //   diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0xA2c57691b8DF0D8479f5f888c69346363D23a49F') as string,
  //   diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0xaCb13B4c527eD6237f7DB6E95Ef71929d1e13DD6') as string,
  //   resaleMarketplace: '0x166eD118F380dDFe1F4FD3ccc7D2C5CaeCf0AE96',
  //   tokenPurchaser: undefined,
  //   creditHandler: undefined
  // },
  // '0x5': {
  //   // Ethereum Goerli
  //   factory: '0x12EF5310499318C90C55077241137Db52189b036',
  //   erc777: '0x4e6a5B076730954d80e55dDb2d2e7E732B5bAb70',
  //   minterMarketplace: '0x14ef15A945b6Cae28f4FA3862E41d74E484Cd3B5',
  //   diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0xEF85370b8F136E2F28eA904bF0dA5acac3D1d74f') as string,
  //   diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //     '0x6B3c06b39Aa1ADe73c625b184326d4837c7a2b64') as string,
  //   resaleMarketplace: '0x73eDc2F5Fc3F895Dfc6aE8a580a5969640260b79',
  //   tokenPurchaser: '0x9dCbe7021803eBb3153412Ed719A2d0B887afB8e' as string,
  //   creditHandler: '0xad78463579Ff43bdC917674c64749c35c7E325f5' as string
  // },
  // '0x13881': {
  //  // Matic Mumbai
  //  factory: '0x72639374fC9e4eec25839080763025A1d3E710EC',
  //  erc777: '0x1AeAb89553233D1045b506e8DCBFa3df76E18896',
  //  minterMarketplace: '0x4594D508cDa05D016571082d467889f4629e1f56',
  //  diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //    '0xbB236Ce48dDCb58adB8665E220FE976bA5d080a5') as string,
  //  diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
  //    '0x2c8BA9f098CD319a971cE2705F26723c81044Cb0') as string,
  //  resaleMarketplace: '0x0F08c99070fbebDa7E324596d95635d30D414070',
  //  tokenPurchaser: undefined,
  //  creditHandler: undefined
  //},
  '0xaa36a7': {
    // Ethereum Sepolia
    factory: undefined,
    erc777: '0x27F4843209f43EC32cd905868121039021a86739',
    minterMarketplace: undefined,
    diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
      '0x05f79B2C8173c07470a7Bb2B9990a0098f158Ac5') as string,
    diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
      '0x1F89Cc515dDc53dA2fac5B0Ca3b322066A71E6BA') as string,
    resaleMarketplace: undefined,
    tokenPurchaser: undefined,
    creditHandler: undefined,
    licenseExchange: '0xE71E90841a7f9331949e2d0ef40e0f93cf171863'
  },
  '0x89': {
    // Matic Mainnet
    factory: undefined,
    erc777: '0x2b0fFbF00388f9078d5512256c43B983BB805eF8',
    minterMarketplace: undefined,
    diamondFactory: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
      '0x2469f47b61cb9c1724ba816e861475a89bd8cf69') as string,
    diamondMarketplace: (import.meta.env.VITE_DIAMONDS_ENABLED === 'true' &&
      '0xafbacedad4117ea6f53686e7702f012d0bbff452') as string,
    resaleMarketplace: undefined,
    tokenPurchaser: undefined,
    creditHandler: undefined
  },
  '0x1': {
    // Ethereum Mainnet
    factory: '0xA2A7e7636AB4374847074c147BE770624F43342E',
    erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
    minterMarketplace: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
    diamondFactory: undefined,
    diamondMarketplace: '0x5c31677c7E73F97020213690F736A8a2Ff922EBC',
    resaleMarketplace: undefined,
    tokenPurchaser: undefined,
    creditHandler: undefined
  },
  '0x250': {
    // Astar Mainnet
    factory: undefined,
    erc777: '0x2b0fFbF00388f9078d5512256c43B983BB805eF8',
    minterMarketplace: undefined,
    diamondFactory: '0xC475c824715c0f0DcbC936F5c644254159e95439',
    diamondMarketplace: '0xd402CB64A138B2F50C3e810d4fD71344583173DE',
    resaleMarketplace: undefined,
    tokenPurchaser: undefined,
    creditHandler: undefined
  },
  '0x2105': {
    // Base Mainnet
    factory: undefined,
    erc777: '0x2b0fFbF00388f9078d5512256c43B983BB805eF8',
    minterMarketplace: undefined,
    diamondFactory: '0x1F89Cc515dDc53dA2fac5B0Ca3b322066A71E6BA',
    diamondMarketplace: '0x58795f50b50d492C4252B9BBF78485EF4043FF3E',
    resaleMarketplace: undefined,
    tokenPurchaser: undefined,
    creditHandler: undefined
  }
};

const InitialState: ContractsInitialType = {
  minterInstance: undefined,
  resaleInstance: undefined,
  factoryInstance: undefined,
  erc777Instance: undefined,
  diamondFactoryInstance: undefined,
  diamondMarketplaceInstance: undefined,
  tokenPurchaserInstance: undefined,
  creditHandlerInstance: undefined,
  currentChain: import.meta.env.VITE_DEFAULT_BLOCKCHAIN as BlockchainType,
  currentUserAddress: undefined,
  programmaticProvider: undefined,
  contractCreator: undefined,
  realChain: undefined,
  coingeckoRates: undefined,
  licenseExchangeInstance: undefined
};

export default function userStore(
  state: ContractsInitialType = InitialState,
  action: ContractsActionsType
): ContractsInitialType {
  switch (action.type) {
    case types.SET_CHAIN_ID:
      if (
        action.currentChain !== undefined &&
        contractAddresses[action.currentChain] !== undefined
      ) {
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
							    "name": "sepolia",
							    "chainId": 11155111,
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
            erc777Instance: undefined,
            contractCreator: undefined,
            diamondFactoryInstance: undefined,
            diamondMarketplaceInstance: undefined
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
            contractAddresses[action.currentChain]?.factory,
            factoryAbi
          ),
          minterInstance: contractCreator(
            contractAddresses[action.currentChain]?.minterMarketplace,
            minterAbi
          ),
          resaleInstance: contractCreator(
            contractAddresses[action.currentChain]?.resaleMarketplace,
            resaleAbi
          ),
          erc777Instance: contractCreator(
            contractAddresses[action.currentChain]?.erc777,
            erc777Abi
          ),
          diamondFactoryInstance: contractCreator(
            contractAddresses[action.currentChain]?.diamondFactory,
            diamondFactoryAbi
          ),
          diamondMarketplaceInstance: contractCreator(
            contractAddresses[action.currentChain]?.diamondMarketplace,
            diamondMarketplaceAbi
          ),
          tokenPurchaserInstance: contractCreator(
            contractAddresses[action.currentChain]?.tokenPurchaser,
            tokenPurchaserAbi
          ),
          creditHandlerInstance: contractCreator(
            contractAddresses[action.currentChain]?.creditHandler,
            creditHandlerAbi
          ),
          licenseExchangeInstance: contractCreator(
            contractAddresses[action.currentChain]?.licenseExchange,
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
          erc777Instance: undefined,
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
