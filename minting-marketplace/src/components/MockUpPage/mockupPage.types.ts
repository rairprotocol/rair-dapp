import {
  INftProductOffers,
  INftProductType,
  TFileType,
  TMetadataType,
  TTokenData
} from '../../axios.responseTypes';
import { ColorChoice } from '../../ducks/colors/colorStore.types';
import { UserType } from '../../ducks/users/users.types';

export interface ITitleSingleTokenView {
  title: string;
  primaryColor: ColorChoice;
}

export interface ILikeButton {
  likeButtonStyle: string;
}

export interface IEtherscanIconComponent {
  classTitle: string;
  contract: string;
  selectedToken: string;
  blockchain: BlockchainType | undefined;
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
  selectedData: TMetadataType;
}

export interface INftVideoplayer {
  selectVideo: TFileType | undefined;
  main?: boolean;
  setSelectVideo: (selectVideo: TFileType | undefined) => void;
}

export interface ISerialNumberBuySell {
  tokenData: TTokenData[];
  handleClickToken: (tokenId: string) => Promise<void>;
  blockchain: BlockchainType | undefined;
  product: string;
  contract: string;
  totalCount: number;
  selectedToken: string;
  setSelectedToken: (tokenId: string) => void;
  primaryColor: ColorChoice;
  textColor: string;
  offerData: INftProductOffers;
  currentUser: string;
  loginDone: boolean;
}
export interface ISellButton {
  currentUser: string;
  tokenData: TTokenData[];
  selectedToken: string;
  sellingPrice?: string;
  isInputPriceExist: boolean;
  setIsInputPriceExist: (inputPrice: boolean) => void;
  setInputSellValue: (inputSellValue: string) => void;
}

export interface ISingleTokenViewProperties {
  selectedData: TMetadataType;
  textColor: string;
}

export interface IBuySellButton {
  title: string;
  handleClick?: () => void;
  isColorPurple: boolean;
  disabled?: boolean;
}

export interface IUnlockableVideosSingleTokenPage {
  productsFromOffer: TFileType[];
  selectVideo: TFileType | undefined;
  setSelectVideo: (videoFile: TFileType | undefined) => void;
  openVideoplayer: boolean;
  setOpenVideoPlayer: (value: boolean) => void;
  handlePlayerClick: () => void;
  primaryColor: ColorChoice;
}

export interface ITitleCollection {
  title: string;
  userName: string;
  someUsersData: UserType;
  selectedData: TMetadataType;
  currentUser?: UserType;
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
  currentUser: string;
  tokenData: TTokenData[];
  selectedToken: string;
}

export interface INftDataPageMain {
  blockchain: BlockchainType | undefined;
  contract: string;
  currentUser: string;
  data: any | undefined;
  handleClickToken: (tokenId: string) => Promise<void>;
  product: string;
  productsFromOffer: TFileType[];
  primaryColor: ColorChoice;
  selectedData: TMetadataType;
  selectedToken: string;
  setSelectedToken: (tokenId: string) => void;
  tokenData: TTokenData[];
  totalCount: number;
  textColor: string;
  offerData: INftProductOffers;
  offerDataInfo: INftProductOffers[];
  offerPrice?: string[];
  userData?: UserType;
  someUsersData: UserType;
  ownerInfo: INftProductType;
  embeddedParams: any | undefined;
  loginDone: boolean;
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
