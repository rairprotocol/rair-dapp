import { MultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AccountSigner } from '@alchemy/aa-ethers';
import { ethers } from 'ethers';

import {
  setChainId,
  setCoingeckoRates,
  setProgrammaticProvider,
  setRealChain,
  setUserAddress
} from './actions';

type AbiInputs = {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
};

type AbiSingleType = {
  anonymous: boolean;
  inputs?: AbiInputs[];
  outputs?: AbiInputs[];
  stateMutability: string;
  name: string;
  type: string;
};

export type AbiType = AbiSingleType[];

export type ContractsInitialType = {
  minterInstance: ethers.Contract | undefined;
  resaleInstance: ethers.Contract | undefined;
  factoryInstance: ethers.Contract | undefined;
  erc777Instance: ethers.Contract | undefined;
  licenseExchangeInstance: ethers.Contract | undefined;
  diamondFactoryInstance: ethers.Contract | undefined;
  diamondMarketplaceInstance: ethers.Contract | undefined;
  tokenPurchaserInstance: ethers.Contract | undefined;
  creditHandlerInstance: ethers.Contract | undefined;
  currentChain: BlockchainType | undefined;
  currentUserAddress: string | undefined;
  programmaticProvider: AccountSigner<MultiOwnerModularAccount> | undefined;
  contractCreator:
    | undefined
    | ((
        address: string | undefined,
        abi: AbiType
      ) => ethers.Contract | undefined);
  realChain: BlockchainType | undefined;
  web3Provider?: undefined | ethers.providers.Web3Provider;
  coingeckoRates?: { [key: string]: number };
};

export type ContractContents = {
  factory?: string;
  erc777?: string;
  minterMarketplace?: string;
  diamondFactory?: string;
  diamondMarketplace?: string;
  resaleMarketplace?: string;
  tokenPurchaser?: string;
  creditHandler?: string;
  licenseExchange?: string;
};

export type ContractAddressesType = {
  [key in BlockchainType]?: ContractContents;
};

export type SetChainId = ReturnType<typeof setChainId>;
export type SetUserAddress = ReturnType<typeof setUserAddress>;
export type SetProgrammaticProvider = ReturnType<
  typeof setProgrammaticProvider
>;
export type SetRealChain = ReturnType<typeof setRealChain>;
export type SetCoingeckoRates = ReturnType<typeof setCoingeckoRates>;

export type ContractsActionsType =
  | SetChainId
  | SetUserAddress
  | SetProgrammaticProvider
  | SetRealChain
  | SetCoingeckoRates;
