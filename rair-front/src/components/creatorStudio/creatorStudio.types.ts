//@ts-nocheck
import { MouseEvent } from "react";
import { ReactNode } from "react";
import { ethers } from "ethers";
import { Hex } from "viem";

import {
  TAttributes,
  TOfferPool,
  TProducts,
  TTokenData,
} from "../../axios.responseTypes";
import { CatalogItem } from "../../redux/tokenSlice";
import { MediaFile } from "../../types/databaseTypes";
import { ContractType } from "../adminViews/adminView.types";
import { OptionsType } from "../common/commonTypes/InputSelectTypes.types";
export interface IMarketplaceOfferConfig {
  array: TMarketplaceOfferConfigArrayItem[];
  index: number;
  nodeFee: bigint;
  minterDecimals: number;
  treasuryFee: bigint;
  treasuryAddress: string;
  simpleMode: boolean;
  rerender: () => void;
  enabled: boolean;
}

export type TListOffers = Pick<
  TWorkflowContextType,
  | "setStepNumber"
  | "simpleMode"
  | "switchBlockchain"
  | "gotoNextStep"
  | "forceRefetch"
  | "fetchingData"
> & {
  stepNumber: number;
  contractData: TDiamondContractData | undefined;
};
export type TDiamondMinterMarketplace = Pick<
  TWorkflowContextType,
  | "MINTERHash"
  | "simpleMode"
  | "setStepNumber"
  | "gotoNextStep"
  | "mintingRole"
  | "contractData"
  | "forceRefetch"
> & {
  stepNumber: number;
};

export interface ICustomFeeRow {
  index: number;
  array: TCustomPayments[];
  recipient: string | undefined;
  canBeContract: boolean;
  deleter: (index: number) => void;
  percentage: bigint;
  rerender: () => void;
  editable: boolean;
  message?: string;
  minterDecimals: bigint;
  disabled?: boolean;
  marketValuesChanged?: boolean;
  setMarketValuesChanged?: (value: boolean) => void;
  price?: string;
  symbol?: string;
}

export interface ITokenURIRow {
  tokenId: string;
  metadataURI: string;
  deleter: (index: number) => void;
  index: number;
  array: TUniqueURIArray[];
  lastTokenInProduct: number;
}

export interface IIBlockchainURIManager {
  contractData: TContractData;
  collectionIndex: string;
  refreshNFTMetadata: () => Promise<TTokenData[] | undefined>;
  changeFile: boolean;
}
export type TParamsBatchMetadata = {
  address: string;
  collectionIndex: string;
};

export type TCustomPayments = {
  recipient: string | undefined;
  percentage: bigint;
  editable: boolean;
  message?: string;
  canBeContract: boolean;
};

export type TMarketData = {
  fees: TCustomPayments[];
  visible: boolean;
};
export interface IDiamondOfferRow {
  index: number;
  deleter: () => void;
  offerName: string;
  range: string[];
  price: string;
  _id: string | undefined;
  array: TMarketplaceOfferConfigArrayItem[];
  rerender: () => void;
  maxCopies: number;
  blockchainSymbol: string | undefined;
  allowedCopies: string;
  lockedCopies: string;
  simpleMode: boolean;
  instance: ethers.Contract | undefined;
  diamondRangeIndex: string;
  sponsored?: boolean;
  forceRefetch: () => void;
  fetchingData: boolean;
}

export type TMarketplaceOfferConfigArrayItem = {
  contract: string;
  copies: number;
  allowedCopies: string;
  lockedCopies: string;
  creationDate: string;
  customSplits?: TCustomPayments[];
  diamond: boolean;
  diamondRangeIndex: string;
  lockedTokens: string;
  marketData: TMarketData;
  offerIndex?: string;
  offerName: string;
  price: string;
  product: string;
  range: string[];
  selected: boolean;
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
  tokensAllowed?: string;
};

export type TAddDiamondOffer = {
  offerName: string;
  range: string[];
  price: string;
  tokensAllowed: string;
  lockedTokens: string;
};

export type TMetadataExtra = {
  metadataURI: string;
  singleMetadata: boolean;
};

export type TWorkflowProduct = TProducts & {
  tokenLock: TTokenLock | undefined;
};

export type TContractData = Omit<CatalogItem, "product" | "offerPool"> & {
  instance: ethers.Contract;
  nfts: TTokenData[];
  product: TWorkflowProduct;
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

export type TWorkflowContextType = {
  MINTERHash: string | undefined;
  checkMarketRoles: () => void;
  contractData: TContractData | TDiamondContractData | undefined;
  steps: TSteps[];
  setStepNumber: Function;
  gotoNextStep: () => void;
  switchBlockchain: () => Promise<void>;
  goBack: () => void;
  mintingRole: boolean | undefined;
  traderRole: boolean | undefined;
  onMyChain: boolean | undefined;
  tokenInstance: ethers.Contract | TContractData | undefined;
  simpleMode: boolean;
  forceRefetch: () => void;
  refreshNFTMetadata: () => Promise<TTokenData[] | undefined>;
  fetchingData: boolean;
};

export type TParamsDiamondListOffers = {
  collectionIndex: string;
};

export type TListOffersProductType = Omit<TProducts, "offers"> & {
  tokenLock: TTokenLock | undefined;
  offers: TMarketplaceOfferConfigArrayItem[];
};

export type TDiamondContractData = Omit<CatalogItem, "product" | "offerPool"> &
  TMetadataExtra & {
    instance: ethers.Contract;
    nfts: TTokenData[];
    product: TListOffersProductType;
  };

export type TParamsListLocks = {
  address: Hex;
};
export interface IMediaUpload {
  setStepNumber?: Function;
  contractData?: TContractData | TDiamondContractData | undefined;
  stepNumber?: number;
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
  external: boolean;
  description: string;
};

export type TChoiceAllOptions = {
  contract: string;
  product: string;
  offer: any;
};

export type TCategories = {
  name: string;
  _id: string;
};

export interface IMediaUploadRow {
  item: MediaFile;
  offerList: OptionsType[];
  deleter: () => void;
  rerender: () => void;
  index: number;
  array: MediaFile[];
  categoriesArray: OptionsType[];
}

export interface IOfferRow {
  index: number;
  deleter: () => void;
  name: string;
  starts: string;
  ends: string;
  price: string;
  fixed?: boolean | undefined;
  array: TOfferListItem[];
  rerender: () => void;
  maxCopies: number;
  blockchainSymbol: string | undefined;
}

export interface IListOffers {
  mintingRole: boolean;
  checkMarketRoles: () => void;
  contractData: TContractData | undefined;
  setStepNumber: Function;
  stepNumber: number;
  gotoNextStep: () => (() => void) | undefined;
  goBack: () => void;
  forceRefetch: () => void;
}

export type TParamsListOffers = {
  address: string;
  collectionIndex: string;
};

export type TOfferListItem = {
  ends: string;
  fixed?: boolean;
  name: string;
  price: string;
  starts: string;
};

export interface IPropertyRow {
  trait_type: string;
  value: string;
  deleter: () => void;
  rerender: () => void;
  array: TAttributes[];
  index: number;
}

export type TUniqueURIArray = {
  tokenId: string;
  metadataURI: string;
};

export type TNextToken = Pick<
  TTokenData,
  "uniqueIndexInContract" | "metadataURI"
>;
export type TResaleMarketplace = Pick<
  TWorkflowContextType,
  "contractData" | "setStepNumber" | "gotoNextStep" | "goBack" | "simpleMode"
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
  refreshNFTMetadata: () => Promise<TTokenData[] | undefined>;
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
  "contractData" | "goBack" | "setStepNumber" | "gotoNextStep"
> & {
  stepNumber: number;
};

export type TSingleMetadataType = Pick<
  TWorkflowContextType,
  "contractData" | "setStepNumber" | "gotoNextStep" | "simpleMode"
> & {
  stepNumber: number;
};

export type TBatchMetadataType = {
  Artist: string;
  "Boson Movement"?: string;
  Description: string;
  FermionFreckles?: string;
  Image: string;
  NFTID: string;
  Name: string;
  "Public Address": string | undefined;
  external_url?: string;
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

export type TParamsContractDetails = {
  address: Hex;
  blockchain: Hex;
};

export type TWorkflowParams = TParamsContractDetails & {
  collectionIndex: string;
};

export type TSetData = {
  title: string;
  contractAddress: string;
  blockchain: Hex | undefined;
  products: TProducts[];
};

export type IForwardFunctions = {
  label: string;
  action:
    | (() => Promise<void>)
    | (() => void)
    | undefined
    | ((e?: MouseEvent<HTMLButtonElement>) => Promise<void>);
  disabled?: boolean;
  visible?: boolean;
};

export type TContractsNetworkContract = {
  blockchain: Hex | undefined;
  contractAddress: Hex;
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

export type TListCollectionsContractResponse = {
  successs: boolean;
  contract: TContractsNetworkContract;
};

export type TListCollectionsNetworkProductsResponse = {
  success: boolean;
  products: TProducts[];
};

export type TListCollectionsOffers = TProducts & {
  offerPool: TOfferPool;
};

export type TContractsNetworkOffersResponse = {
  success: boolean;
  products: TListCollectionsOffers[];
};

export type TProductDataLocal = {
  collectionIndexInContract: number;
  name: string;
  diamond: boolean;
  bannerImage?: string;
};

export type TSetDataUseState = {
  title: string;
  contractAddress: string;
  blockchain: Hex | undefined;
  products: TProductDataLocal[];
};

export interface IFixedBottomNavigation {
  forwardFunctions?: IForwardFunctions[];
}

export interface INavigatorContract {
  children: ReactNode;
  contractAddress: string;
  contractName: string;
  contractBlockchain: Hex | undefined;
  contractProducts?: any;
}

export interface INavigatorFactory {
  children: ReactNode;
}

export type TContractsNetworkResponseType = {
  success: boolean;
  contract: TContractsNetworkContract;
};

export type TContractsDetailsProducts = Omit<TProducts, "offers">;

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
  blockchain: Hex | undefined;
  diamond: boolean;
};
