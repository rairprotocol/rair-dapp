import { TProducts } from '../../axios.responseTypes';
import { ContractType } from '../adminViews/adminView.types';

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
  action: (() => Promise<void>) | (() => void) | undefined;
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

export type TMetadataExtra = {
  metadataURI: string;
  singleMetadata: boolean;
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
