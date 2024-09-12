import { Dispatch, SetStateAction } from 'react';
import { Hex } from 'viem';

import { CatalogItem, CollectionTokens } from '../../../redux/tokenSlice';
import { CatalogVideoItem } from '../../../types/commonTypes';
import { TokenMetadata, User } from '../../../types/databaseTypes';
import { TOfferType } from '../../marketplace/marketplace.types';
import { TEmbeddedParams } from '../mockupPage.types';

import {
  TMetadataType,
  TProducts,
  TTokenData
} from './../../../axios.responseTypes';
export interface IAuthenticityBlock {
  tokenData: { [index: string]: CollectionTokens };
  title: boolean;
  collectionToken: string;
  selectedToken?: string | undefined;
  selectedData?: TMetadataType | undefined;
}

export interface INftItemComponent {
  item: CatalogItem;
  index: number;
  playing: number | null;
  setPlaying: (arg: null | number) => void;
  className?: string;
}

export type TSortChoice = 'down' | 'up';

export interface INftListComponent {
  titleSearch: string;
  sortItem: TSortChoice | undefined;
}

export interface ISvgKey {
  color: string;
  bgColor: string;
  mobile?: boolean;
}

export type TVideoPlayerViewSpecialVideoType = {
  urlVideo: string;
  mediaIdVideo: string;
  videoTime: string;
  videoName: string;
  VideoBg: string;
};

export type TAuthenticityStyled = {
  primaryColor?: string;
  isDarkMode?: boolean;
};

export interface INftDataCommonLinkComponent {
  embeddedParams?: TEmbeddedParams;
  setTokenNumber: Dispatch<SetStateAction<number | undefined>>;
  tokenNumber: number | undefined;
}

export type TParamsNftDataCommonLink = {
  contract: Hex;
  product: string;
  tokenId: string;
  blockchain: Hex;
};

export interface IBreadcrumbsComponent {
  embeddedParams?: TEmbeddedParams | undefined;
}

export interface INftCollectionPageComponent {
  embeddedParams: TEmbeddedParams | undefined;
  blockchain: Hex | undefined;
  selectedData?: TokenMetadata;
  offerPrice: string[] | undefined;
  getAllProduct: (
    fromToken: string,
    toToken: string,
    attributes: any
  ) => Promise<void>;
  showToken: number;
  setShowToken: (token: number) => void;
  isLoading: boolean;
  tokenDataFiltered: TTokenData[];
  setTokenDataFiltered: (filteredTokens: any[]) => void;
  someUsersData: User | null | undefined;
  offerDataCol: TOfferType[] | undefined;
  offerAllData: TProducts | undefined;
  collectionName: string | undefined;
  showTokensRef: any;
  tokenNumber: number | undefined;
}

export interface INftUnlockablesPage {
  embeddedParams: TEmbeddedParams | undefined;
  productsFromOffer: CatalogVideoItem[] | undefined;
  selectedToken: string | undefined;
  someUsersData: User | null | undefined;
  collectionName: string | undefined;
  setTokenDataFiltered: (filteredData: any) => void;
}

export interface INftSingleUnlockables {
  embeddedParams: TEmbeddedParams | undefined;
  productsFromOffer: CatalogVideoItem[];
  setTokenDataFiltered: (filteredData: any) => void;
  setSelectVideo: (selectedVideo: CatalogVideoItem) => void;
  isDiamond: undefined | boolean;
}

export type TRarity = 'Ultra Rair' | 'Rair' | 'Common';
export type TUnlockRarity =
  | 'Unlock Ultra Rair'
  | 'Unlock Rair'
  | 'Unlock Common';

export type TRarityType = TRarity[] | TUnlockRarity[];

export interface INftItemForCollectionViewComponent {
  embeddedParams?: TEmbeddedParams | undefined;
  blockchain: Hex | undefined;
  pict: string | undefined;
  offerPrice: string[] | undefined;
  index: string;
  metadata: TMetadataType;
  offer: string;
  selectedData: TMetadataType | undefined;
  someUsersData: User | null | undefined;
  userName: string | undefined;
  tokenDataLength?: number;
}

export interface ICollectionInfo {
  blockchain: Hex | undefined;
  offerData: TOfferType[] | undefined;
  openTitle: boolean;
  mintToken?: boolean;
  connectUserData?: () => void;
  contractAddress?: string;
  setPurchaseStatus?: any;
  closeModal?: any;
}

export type TCollectionInfoBody = {
  isDarkMode?: boolean;
};

export interface ICustomButton {
  text: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  textColor?: string | undefined;
  margin?: string;
  custom?: boolean;
  border?: string;
  font?: string;
  background?: string;
  hoverBackground?: string;
  padding?: string;
  loading?: boolean;
}

export type TShowMoreContainer = {
  width: string | undefined;
  height: string | undefined;
  textColor: string | undefined;
  margin: string | undefined;
  background?: string | undefined;
  loading?: string;
};

export type TShowMoreItem = {
  width: string | undefined;
  height: string | undefined;
  textColor: string | undefined;
  background?: string | undefined;
  border?: string | undefined;
  primaryColor?: string;
  onClick?: () => void;
  font?: string;
  bacground?: string;
  hoverBackground?: string | undefined;
  padding?: string | undefined;
};

export type TShowMoreText = {
  font?: string | undefined;
  fontColor?: string | undefined;
  fontSize?: string | undefined;
};

export type TModalContentCloseBtnStyled = {
  isDarkMode: boolean;
};

export interface INftDifferentRarity {
  title: TRarity | TUnlockRarity;
  setTokenDataFiltered: (filteredTokenData: TTokenData[]) => void;
  isUnlocked: boolean[];
  embeddedParams: TEmbeddedParams | undefined;
}

export type TNftSingleUnlockablesSections = {
  [key: string]: CatalogVideoItem[];
};

export type TSplashPageSetSelectedVideoArgs = {
  videoBg: string;
  urlVideo: string;
  mediaIdVideo: string;
};

export interface IVideoPlayerView {
  productsFromOffer: CatalogVideoItem[];
  primaryColor?: string;
  selectVideo: CatalogVideoItem | undefined;
  setSelectVideo: (selectedVideo: any) => void;
  whatSplashPage?: string;
  someAdditionalData?: TVideoPlayerViewSpecialVideoType[];
  unlockables?: boolean;
}

export type TGettingPriceReturnType = {
  maxPrice: string;
  minPrice: string;
};

export type TNftExternalLinkType = {
  contract: CatalogItem;
  tokens: TTokenData[];
  totalCount: number;
};
