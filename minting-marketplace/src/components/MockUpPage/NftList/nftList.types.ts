import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { TNftDataItem } from '../../../ducks/nftData/nftData.types';
import { UserType } from '../../../ducks/users/users.types';
import { TOfferType } from '../../marketplace/marketplace.types';
import { TEmbeddedParams } from '../mockupPage.types';

import {
  TContract,
  TFileType,
  TMetadataType,
  TProducts,
  TTokenData
} from './../../../axios.responseTypes';
export interface IAuthenticityBlock {
  tokenData: TTokenData[];
  title: boolean;
  collectionToken: string;
  selectedToken?: string | undefined;
  selectedData?: TMetadataType | undefined;
}

export interface INftItemComponent {
  blockchain: BlockchainType | undefined;
  price: string[];
  pict: string;
  contractName: string;
  collectionIndexInContract: string;
  collectionName: string;
  ownerCollectionUser: string;
}

export type TSortChoice = 'down' | 'up';

export interface INftListComponent {
  data: TNftDataItem[] | null;
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
  primaryColor: ColorChoice;
};

export interface INftDataCommonLinkComponent {
  userData: UserType;
  embeddedParams: TEmbeddedParams | undefined;
  loginDone: boolean;
}

export type TParamsNftDataCommonLink = {
  contract: string;
  product: string;
  tokenId: string;
  blockchain: BlockchainType;
};

export interface IBreadcrumbsComponent {
  embeddedParams?: TEmbeddedParams | undefined;
}

export interface INftCollectionPageComponent {
  embeddedParams: TEmbeddedParams | undefined;
  blockchain: BlockchainType | undefined;
  selectedData: TMetadataType | undefined;
  tokenData: TTokenData[] | null;
  totalCount: number | undefined;
  offerPrice: string[] | undefined;
  getAllProduct: (fromToken: number, toToken: number) => Promise<void>;
  showToken: number;
  setShowToken: (token: number) => void;
  isLoading: boolean;
  tokenDataFiltered: TTokenData[];
  setTokenDataFiltered: (filteredTokens: any[]) => void;
  userData: UserType;
  someUsersData: UserType | null | undefined;
  offerDataCol: TOfferType[] | undefined;
  offerAllData: TProducts | undefined;
  collectionName: string | undefined;
}

export interface INftUnlockablesPage {
  embeddedParams: TEmbeddedParams | undefined;
  productsFromOffer: TFileType[];
  primaryColor: ColorChoice;
  selectedToken: string | undefined;
  tokenData: TTokenData[] | null;
  someUsersData: UserType | null | undefined;
  collectionName: string | undefined;
  setTokenDataFiltered: (filteredData: any) => void;
}

export interface INftSingleUnlockables {
  embeddedParams: TEmbeddedParams | undefined;
  productsFromOffer: TFileType[];
  setTokenDataFiltered: (filteredData: any) => void;
  primaryColor: ColorChoice;
  setSelectVideo: (selectedVideo: TFileType) => void;
}

export type TRarity = 'Ultra Rair' | 'Rair' | 'Common';
export type TUnlockRarity =
  | 'Unlock Ultra Rair'
  | 'Unlock Rair'
  | 'Unlock Common';

export type TRarityType = TRarity[] | TUnlockRarity[];

export interface INftItemForCollectionViewComponent {
  embeddedParams?: TEmbeddedParams | undefined;
  blockchain: BlockchainType | undefined;
  pict: string | undefined;
  offerPrice: string[] | undefined;
  index: string;
  metadata: TMetadataType;
  offer: string;
  selectedData: TMetadataType | undefined;
  someUsersData: UserType | null | undefined;
  userName: string | undefined;
  tokenDataLength?: number;
}

export interface ICollectionInfo {
  blockchain: BlockchainType | undefined;
  offerData: TOfferType[] | undefined;
  openTitle: boolean;
  someUsersData: UserType | null | undefined;
}

export type TCollectionInfoBody = {
  primaryColor: ColorChoice;
};

export interface ICustomButton {
  text: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  textColor?: string | undefined;
  margin?: string;
  custom?: boolean;
}

export type TShowMoreContainer = {
  width: string | undefined;
  height: string | undefined;
  textColor: string | undefined;
  margin: string | undefined;
};

export type TShowMoreItem = {
  width: string | undefined;
  height: string | undefined;
  textColor: string | undefined;
  background?: boolean | undefined;
  primaryColor?: ColorChoice;
  onClick?: () => void;
};

export type TModalContentCloseBtnStyled = {
  primaryColor: ColorChoice;
};

export interface INftDifferentRarity {
  title: TRarity | TUnlockRarity;
  setTokenDataFiltered: (filteredTokenData: TTokenData[]) => void;
  isUnlocked: boolean[];
  embeddedParams: TEmbeddedParams | undefined;
}

export type TNftSingleUnlockablesSections = {
  [key: string]: TFileType[];
};

export type TSplashPageSetSelectedVideoArgs = {
  videoBg: string;
  urlVideo: string;
  mediaIdVideo: string;
};

export interface IVideoPlayerView {
  productsFromOffer: TFileType[];
  primaryColor?: ColorChoice;
  selectVideo: TFileType | undefined;
  setSelectVideo: (
    selectedVideo: any /*TFileType | TSplashPageSetSelectedVideoArgs*/
  ) => void;
  whatSplashPage?: string;
  someAdditionalData?: TVideoPlayerViewSpecialVideoType[];
  unlockables?: boolean;
}

export type TGettingPriceReturnType = {
  maxPrice: string;
  minPrice: string;
};

export type TNftExternalLinkType = {
  contract: TContract;
  tokens: TTokenData[];
  totalCount: number;
};
