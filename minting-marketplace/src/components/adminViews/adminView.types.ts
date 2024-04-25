import { TTokenData } from '../../axios.responseTypes';

export type NativeCurrencyType = {
  name: string;
  symbol: string;
  decimals: number;
};

export type ChainDataType = {
  chainId?: BlockchainType;
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

export type BlockchainInfoType = {
  image: string;
  name: string;
  chainId: BlockchainType;
  symbol: string;
  addChainData: {
    chainId: string;
    chainName: string;
    nativeCurrency?: {
      name?: string;
      symbol?: string;
      decimals?: number;
    };
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
  };
};

type ContractInfo = {
  title: string;
  contractAddress: string;
};

export type ContractType = {
  diamond: boolean;
  _id: string;
  title: string;
  blockchain: BlockchainType;
  contractAddress: string;
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
  blockchain: BlockchainType;
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

export type BlockchainSetting = {
  hash: string;
  display: Boolean;
  sync: Boolean;
  name: String;
  _id: String;
};
