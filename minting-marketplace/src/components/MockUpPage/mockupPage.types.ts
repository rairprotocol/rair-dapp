import {
  TFileType,
  TMetadataType,
  TProducts,
  TTokenData
} from '../../axios.responseTypes';
import { ColorChoice } from '../../ducks/colors/colorStore.types';
import { UserType } from '../../ducks/users/users.types';
import { TOfferType } from '../marketplace/marketplace.types';

export interface ITitleSingleTokenView {
  title: string;
  primaryColor: ColorChoice;
}

export interface INftItemForCollectionView {
  embeddedParams?: TEmbeddedParams;
  blockchain: BlockchainType | undefined;
  pict: string | undefined;
  offerPrice?: string[] | undefined;
  index: string;
  metadata: TMetadataType;
  offer: string | undefined;
  selectedData?: TMetadataType | undefined;
  someUsersData?: UserType | null | undefined;
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
}

export type TParamsNftItemForCollectionView = {
  blockchain: BlockchainType;
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

export type TWhatPage = 'nft' | 'video';

export interface IPaginationBox {
  changePage: (currentPage: number) => void;
  currentPage: number;
  totalPageForPagination: number | undefined;
  whatPage: TWhatPage;
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
  blockchain: BlockchainType | undefined;
  currentTokenId: string | undefined;
}

export type TParamsBreadcrumbsComponent = {
  blockchain: BlockchainType;
  contract: string;
  product: string;
  tokenId: string;
};

export interface ISharePopUp {
  onClose: (value: number) => void;
  selectedValue: number;
  open: boolean;
  primaryColor: ColorChoice;
  selectedData?: TMetadataType | undefined;
}

export interface INftVideoplayer {
  selectVideo: TFileType | undefined;
  main?: boolean;
  setSelectVideo?: (selectVideo: TFileType | undefined) => void;
}

export interface ISerialNumberBuySell {
  tokenData: { [index: string]: TTokenData } | null;
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  blockchain: BlockchainType | undefined;
  product: string | undefined;
  contract: string | undefined;
  totalCount: number | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
  textColor: string | undefined;
  offerData: TOfferType | undefined;
  handleTokenBoughtButton: () => void;
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
}

export interface ISingleTokenViewProperties {
  selectedData: TMetadataType;
  textColor: string | undefined;
}

export interface IBuySellButton {
  title: string;
  handleClick?: () => void;
  isColorPurple: boolean;
  disabled?: boolean;
}

export type TUnlockableVideosSingleTokenPage = {
  productsFromOffer: TFileType[] | undefined;
  selectVideo: TFileType | undefined;
  setSelectVideo: (videoFile: TFileType | undefined) => void;
  openVideoplayer: boolean;
  setOpenVideoPlayer: (value: boolean) => void;
  handlePlayerClick: () => void;
  primaryColor: ColorChoice;
};

export interface ITitleCollection {
  title: string | undefined;
  userName: string | undefined;
  someUsersData: UserType | undefined | null;
  selectedData: TMetadataType | undefined;
  currentUser?: UserType;
  offerDataCol?: TOfferType[] | undefined;
  connectUserData?: any;
}
export interface ICusmonShareButton {
  title: string;
  handleClick: () => void;
  primaryColor: ColorChoice;
  isCollectionPathExist?: boolean;
  moreUnlockablesClassName?: string;
}

export type TParamsTitleCollection = {
  tokenId: string;
  contract: string;
  blockchain: BlockchainType;
  tokens: 'tokens' | 'collection';
};

export interface ISellInputButton {
  tokenData: { [index: string]: TTokenData } | null;
  selectedToken: string | undefined;
  refreshResaleData: () => void;
}

export interface INftDataPageMain {
  blockchain: BlockchainType | undefined;
  contract: string | undefined;
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  product: string | undefined;
  productsFromOffer: TFileType[] | undefined;
  selectedData: TMetadataType | undefined;
  selectedToken: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
  totalCount: number | undefined;
  textColor: string | undefined;
  offerData?: TOfferType | undefined;
  offerDataInfo: TOfferType[] | undefined;
  offerPrice?: string[];
  someUsersData: UserType | null | undefined;
  ownerInfo?: TProducts | undefined;
  embeddedParams?: TEmbeddedParams | undefined;
  handleTokenBoughtButton: () => void;
  setTokenNumber: (arg: undefined | number) => void;
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
  chainId: BlockchainType;
  chainName: string;
};

export interface ISearchPanel {
  primaryColor: ColorChoice;
  textColor: string | undefined;
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export type TModeType = 'collection' | 'tokens' | 'unlockables';

export type TEmbeddedParams = {
  contract: string;
  product: string;
  blockchain: BlockchainType | undefined;
  mode: TModeType;
  setMode: (mode: TModeType) => void;
  tokenId: string;
  setTokenId: (tokenId: string) => void;
};

export type TMetamaskError = {
  code: number;
  message: string;
};
