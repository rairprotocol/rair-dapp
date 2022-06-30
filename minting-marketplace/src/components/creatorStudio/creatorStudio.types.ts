import { ethers } from 'ethers';
import { MouseEvent } from 'react';
import {
  TContract,
  TNftItemResult,
  TProducts,
  TTokenData
} from '../../axios.responseTypes';
import { ContractType } from '../adminViews/adminView.types';

export type TParamsBatchMetadata = {
  address: string;
  collectionIndex: string;
};

export type TParamsListLocks = {
  address: string;
};

export type TMetadataExtra = {
  metadataURI: string;
  singleMetadata: boolean;
};

export type TTokenLock = {
  contract: string;
  isLocked: boolean;
  lockIndex: string;
  lockedTokens: string;
  product: string;
  rande: string[];
  _id: string;
};

export type TWorkflowProduct = TProducts &
  TMetadataExtra & {
    tokenLock: TTokenLock | undefined;
  };

export type TContractData = Omit<TContract, 'product' | 'offerPool'> &
  TMetadataExtra & {
    instance: ethers.Contract;
    nfts: TNftItemResult;
    product: TWorkflowProduct;
  };
export type TResaleMarketplace = Pick<
  TWorkflowContextType,
  | 'contractData'
  | 'correctMinterInstance'
  | 'setStepNumber'
  | 'gotoNextStep'
  | 'goBack'
  | 'simpleMode'
> & {
  stepNumber: number;
};

export interface IBatchMetadataParser {
  contractData: TContractData;
  setStepNumber: (stepNumber: number) => void;
  stepNumber: number;
  gotoNextStep: () => void;
  goBack: () => void;
  simpleMode: boolean;
}

export interface ICustomizeFees {
  contractData: TContractData | undefined;
  correctMinterInstance: ethers.Contract | undefined;
  setStepNumber: (stepNumber: number) => void;
  stepNumber: number;
  gotoNextStep: () => void;
  goBack: () => void;
}

export type TListLocks = Pick<
  TWorkflowContextType,
  'contractData' | 'goBack' | 'setStepNumber' | 'gotoNextStep'
> & {
  stepNumber: number;
};

export type TSingleMetadataType = Pick<
  TWorkflowContextType,
  'contractData' | 'setStepNumber' | 'gotoNextStep' | 'simpleMode'
> & {
  stepNumber: number;
};

export type TBatchMetadataType = {
  Artist: string;
  'Boson Movement': string;
  Description: string;
  FermionFreckles: string;
  Image: string;
  NFTID: string;
  Name: string;
  'Public Address': string | undefined;
  external_url: string;
};

export type TCustomizeFeesArrayItem = {
  percentage: number;
  receiver: string;
};

export interface ICustomPayRateRow {
  index: number;
  array: TCustomizeFeesArrayItem[];
  receiver: string;
  deleter: (index: number) => void;
  percentage: number;
  renderer: () => void;
}

export type TSteps = {
  classic: boolean;
  component: (props: any) => JSX.Element;
  diamond: boolean;
  hasAdvancedFeatures: boolean;
  path: string;
  populatedPath: string;
  shortName: string;
  simple: boolean;
};

export type TWorkflowContextType = {
  contractData: TContractData | undefined;
  steps: TSteps[];
  setStepNumber: Function;
  gotoNextStep: () => void;
  switchBlockchain: () => Promise<void>;
  goBack: () => void;
  mintingRole: boolean | undefined;
  traderRole: boolean | undefined;
  onMyChain: boolean | undefined;
  correctMinterInstance: ethers.Contract | undefined;
  tokenInstance: ethers.Contract | TContractData | undefined;
  simpleMode: boolean;
  forceRefetch: () => void;
};

export interface ILockRow {
  index: number;
  locker: (data: any) => Promise<void>;
  name: string;
  starts: string;
  ends: string;
  price: string;
  array: TListLocksArrayItem[];
  rerender: () => void;
  maxCopies: number;
  lockedNumber: number;
  blockchainSymbol: string | undefined;
}

export type TListLocksArrayItem = {
  ends: string;
  lockedNumber: number;
  name: string;
  price: string;
  productIndex: string;
  starts: string;
};

export type TNftMapping = {
  [key: string]: TTokenData;
};

export type TCustomPayments = {
  recipient: string | undefined;
  percentage: number;
  editable: boolean;
  message: string;
};

export type TParamsContractDetails = {
  address: string;
  blockchain: BlockchainType;
};

export type TSetData = {
  title: string;
  contractAddress: string;
  blockchain: BlockchainType | undefined;
  products: TProducts[];
};

export type IForwardFunctions = {
  label: string;
  action:
    | (() => Promise<void>)
    | (() => void)
    | undefined
    | ((e: MouseEvent<HTMLButtonElement>) => Promise<void>);
  disabled?: boolean;
};

export interface IFixedBottomNavigation {
  forwardFunctions?: IForwardFunctions[];
  backwardFunction: () => void;
  backwardDisabled?: boolean;
}

export type TContractsNetworkContract = {
  blockchain: BlockchainType | undefined;
  contractAddress: string;
  creationDate: string;
  diamond: boolean;
  external: boolean;
  lastSyncedBlock: string;
  metadataURI: string;
  singleMetadata: boolean;
  products: TProducts[];
  title: string;
  transactionHash?: string;
  user: string;
  _id: string;
};

export type TContractsNetworkResponseType = {
  success: boolean;
  contract: TContractsNetworkContract;
};

export type TContractsDetailsProducts = Omit<TProducts, 'offers'> &
  TMetadataExtra;

export type TContractsNetworkProductsResponse = {
  success: boolean;
  products: TContractsDetailsProducts[];
};

export type TApiContractsResponseType = {
  success: boolean;
  contracts: ContractType[];
};

export type TContractsArray = {
  address: string;
  name: string;
  blockchain: BlockchainType | undefined;
  diamond: boolean;
};
