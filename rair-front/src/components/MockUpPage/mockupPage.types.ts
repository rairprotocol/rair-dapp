import { Hex } from 'viem';

import {
  TMetadataType,
  TProducts,
  TTokenData
} from '../../axios.responseTypes';
import { CatalogVideoItem } from '../../redux/videoSlice';
import { MediaFile, User } from '../../types/databaseTypes';
import { TOfferType } from '../marketplace/marketplace.types';

export interface ITitleSingleTokenView {
  title: string;
  isDarkMode: boolean;
}

export interface INftItemForCollectionView {
  embeddedParams?: TEmbeddedParams;
  blockchain: Hex | undefined;
  pict: string | undefined;
  offerPrice?: string[] | undefined;
  index: string;
  metadata: TMetadataType;
  offer: string | undefined;
  selectedData?: TMetadataType | undefined;
  someUsersData?: User | null | undefined;
  userName: string | undefined;
  tokenDataLength?: number;
  playing: string | null;
  indexId: string;
  offerItemData?: any;
  setPlaying: (arg: null | string) => void;
  diamond: boolean;
  offerData?: TOfferType[] | undefined;
  id: string;
  item?: any;
  resaleFlag?: boolean;
  resalePrice?: string;
  usdPrice?: number;
  getMyNft?: any;
  totalNft?: any;
  metadataFilter?: boolean;
}

export type TParamsNftItemForCollectionView = {
  blockchain: Hex;
  contract: string;
  product: string;
  tokenId: string;
};

export interface IOfferItemComponent {
  handleClickToken: () => void;
  token: string;
  index: number;
  metadata: TMetadataType;
  setSelectedToken;
  selectedToken;
}

export interface ISvgLock {
  color: string;
}

export type TWhatPage = 'nft' | 'video' | 'notifications';

export interface IPaginationBox {
  changePage: (currentPage: number) => void;
  currentPage: number;
  totalPageForPagination: number | undefined;
  whatPage: TWhatPage;
  itemsPerPageNotifications?: number;
}

export interface ILikeButton {
  likeButtonStyle: string;
  tokenId: string | undefined;
  selectedToken: string | undefined;
}

export interface IEtherscanIconComponent {
  classTitle: string;
  contract: string | undefined;
  selectedToken: string | undefined;
  blockchain: Hex | undefined;
  currentTokenId: string | undefined;
}

export type TParamsBreadcrumbsComponent = {
  blockchain: Hex;
  contract: string;
  product: string;
  tokenId: string;
};

export interface ISharePopUp {
  onClose: (value: number) => void;
  selectedValue: number;
  open: boolean;
  primaryColor: string;
  selectedData?: TMetadataType | undefined;
}

export interface INftVideoplayer {
  selectVideo: CatalogVideoItem | undefined;
  main?: boolean;
  setSelectVideo?: (selectVideo: CatalogVideoItem | undefined) => void;
}

export interface ISerialNumberBuySell {
  tokenData: { [index: string]: TTokenData } | null;
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  blockchain: Hex | undefined;
  product: string | undefined;
  contract: string | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
  offerData: TOfferType | undefined;
  handleTokenBoughtButton: () => void;
  tokenDataForResale?: any;
}
export interface ISellButton {
  currentUser?: string | undefined;
  tokenData?: { [index: string]: TTokenData } | null;
  selectedToken?: string | undefined;
  sellingPrice?: string;
  isInputPriceExist: boolean;
  setIsInputPriceExist: (inputPrice: boolean) => void;
  setInputSellValue: (inputSellValue: string) => void;
  refreshResaleData: () => void;
  item?: any;
  singleTokenPage?: boolean;
}

export interface ISingleTokenViewProperties {
  selectedData: TMetadataType;
}

export interface IBuySellButton {
  title: string;
  handleClick?: () => void;
  isColorPurple: boolean;
  disabled?: boolean;
}

export type TUnlockableVideosSingleTokenPage = {
  productsFromOffer: CatalogVideoItem[] | undefined;
  selectVideo: CatalogVideoItem | undefined;
  setSelectVideo: (videoFile: CatalogVideoItem | undefined) => void;
  openVideoplayer: boolean;
  setOpenVideoPlayer: (value: boolean) => void;
  handlePlayerClick: () => void;
};

export interface ITitleCollection {
  title: string | undefined;
  userName: string | undefined;
  someUsersData: User | undefined | null;
  selectedData: TMetadataType | undefined;
  currentUser?: User;
  offerDataCol?: TOfferType[] | undefined;
  connectUserData?: any;
  collectionAttributes?: any;
  toggleMetadataFilter?: any;
}
export interface ICusmonShareButton {
  title: string;
  handleClick: () => void;
  primaryColor: string;
  isCollectionPathExist?: boolean;
  moreUnlockablesClassName?: string;
}

export type TParamsTitleCollection = {
  tokenId: string;
  contract: string;
  blockchain: Hex;
  tokens: 'tokens' | 'collection';
};

export interface ISellInputButton {
  tokenData: { [index: string]: TTokenData } | null;
  selectedToken: string | undefined;
  refreshResaleData: () => void;
}

export interface INftDataPageMain {
  blockchain: Hex | undefined;
  contract: string | undefined;
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  product: string | undefined;
  productsFromOffer: CatalogVideoItem[] | undefined;
  selectedData: TMetadataType | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
  offerData?: TOfferType | undefined;
  offerDataInfo: TOfferType[] | undefined;
  offerPrice?: string[];
  someUsersData: User | null | undefined;
  ownerInfo?: TProducts | undefined;
  embeddedParams?: TEmbeddedParams | undefined;
  handleTokenBoughtButton: () => void;
  setTokenNumber?: (arg: undefined | number) => void;
  getProductsFromOffer?: () => void;
}

export type TOffersIndexesData = {
  copies: number;
  id: number;
  pkey: any /*complicated type */;
  range: string[];
  soldCopies: number;
  value: string;
};

export type TSwitchEthereumChainArgs = {
  chainId: Hex;
  chainName: string;
};

export interface ISearchPanel {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export type TModeType = 'collection' | 'tokens' | 'unlockables';

export type TEmbeddedParams = {
  contract: string;
  product: string;
  blockchain: Hex | undefined;
  mode: TModeType;
  setMode: (mode: TModeType) => void;
  tokenId: string;
  setTokenId: (tokenId: string) => void;
};

export type TMetamaskError = {
  code: number;
  message: string;
};
