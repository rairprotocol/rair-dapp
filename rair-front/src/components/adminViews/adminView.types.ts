import { Hex } from 'viem';

import { TTokenData } from '../../axios.responseTypes';

export type NativeCurrencyType = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ChainDataType = {
  chainId?: Hex;
  chainName: string;
  nativeCurrency?: NativeCurrencyType;
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
};

export type BlockchainInfo = {
  chainData: ChainDataType;
  bootstrapColor: string;
};

export type MetamaskError = {
  code: number;
  message: string;
};

export type ContractsResponseType = {
  contracts: ContractType[];
  success: boolean;
};

type ContractInfo = {
  title: string;
  contractAddress: string;
};

export type ContractType = {
  diamond: boolean;
  _id: string;
  title: string;
  blockchain: Hex;
  contractAddress: Hex;
  external?: boolean;
};

export type ContractDataType = ContractInfo | ContractType | undefined;

export type NFTSelectedNumberResponseType = {
  success: boolean;
  result: {
    totalCount: number;
    tokens: TTokenData[];
  };
};

export type TContractSchema = {
  blockchain: Hex;
  contractAddress: string;
  diamond: boolean;
  title: string;
  _id: string;
  creationDate: string;
  external: boolean;
  lastSyncedBlock: string;
  user: string;
};

export type TExternalContractType = {
  contract: TContractSchema;
  numberOfTokensAdded: number;
};

export type Settings = {
  demoUploadsEnabled?: Boolean;
  onlyMintedTokensResult?: Boolean;
  nodeAddress?: String;
  featuredCollection?: any;
  superAdminsOnVault?: Boolean;
  favicon?: string;
  databaseResales?: Boolean;
};
