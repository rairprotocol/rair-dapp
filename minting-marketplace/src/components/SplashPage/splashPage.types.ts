import { TFileType } from '../../axios.responseTypes';
import { ColorChoice } from '../../ducks/colors/colorStore.types';

export interface INumberedCircle {
  index: number;
  primaryColor: ColorChoice;
}

export interface ISplashPageProps {
  loginDone?: boolean;
  connectUserData: () => Promise<void>;
  setIsSplashPage?: (isSplashPage: boolean) => void;
}

export type TSplashPageIsActive = {
  policy: boolean;
  use: boolean;
};

export type TMetamaskError = {
  code: number;
  message: string;
};

export type TNftLaSelectedVideo = {
  VideoBg: string;
  mediaIdVideo: string;
  urlVideo: string;
  videoName: string;
  videoTime: string;
};

export type TSeoInformationType = {
  title?: string;
  ogTitle?: string;
  ogDescription?: string;
  contentName: string;
  content?: string;
  description?: string;
  favicon?: string;
  faviconMobile?: string;
  image?: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export interface IMetaTags {
  seoMetaTags?: TSeoInformationType;
}

export type TSplashPageDataButtonType = {
  buttonColor?: string;
  buttonCustomLogo?: React.ReactNode;
  buttonLabel?: string;
  buttonImg?: string | null;
  buttonLink?: string;
  buttonBorder?: string;
  buttonTextColor?: string;
  buttonMarginTop?: string;
  buttonMarginBottom?: string;
  buttonAction?: () => void;
};

export type TCarouselDataType = {
  title?: string;
  img: string;
  description: string | null;
};

export type TSplashPageVideoData = {
  video: string | null;
  videoTitle?: string;
  videoModuleDescription?: string | null;
  videoModuleTitle?: string;
  demo?: boolean;
  baseURL?: string;
  mediaId?: string;
};

export type TVideoArrayItem = {
  videoName: string;
  videoType: string;
  videoTime: string;
  videoSRC: string | null;
  baseURL?: string;
  mediaId?: string;
  demo?: boolean;
};

export type TExclusiveNFtType = {
  title: string;
  titleColor: string;
};

export type TParamsMarketplaceDemo = {
  blockchain: BlockchainType | undefined;
  contract: string;
  product: string;
};

export type TPurchaseButtonType = {
  contractAddress: string;
  requiredBlockchain: BlockchainType | undefined;
  buttonComponent?: React.ElementType;
  customStyle?: React.CSSProperties;
  presaleMessage?: string;
  customWrapperClassName?: string;
  blockchainOnly?: boolean;
  customSuccessAction?: (nextToken: number) => Promise<void>;
  img?: string;
  offerIndex?: string[];
};

export type TSplashCounterProperties = {
  titleProperty: string;
  titleColor: string;
  propertyDesc: string;
  percent: string;
};

export type TCounterData = {
  titleColor: string;
  title1: string | null;
  title2: string;
  backgroundImage: string;
  btnColorIPFS: string;
  nftCount: number;
  royaltiesNft?: {
    firstBlock: string[];
    secondBlock: string[];
  } | null;
  properties?: TSplashCounterProperties[];
  description: string[];
  nftTitle?: string;
};

export type TSplashDataType = {
  LicenseName?: string;
  title?: string | null;
  titleColor?: string;
  titleImage?: string;
  description?: string[] | string | null;
  textDescriptionCustomStyles?: React.CSSProperties;
  seoInformation?: TSeoInformationType;
  backgroundImage?: string;
  button1?: TSplashPageDataButtonType;
  button2?: TSplashPageDataButtonType;
  button3?: TSplashPageDataButtonType;
  cardFooter?: any;
  NFTName?: string;
  carouselTitle?: string;
  carouselData?: TCarouselDataType[];
  purchaseButton?: TPurchaseButtonType;
  buttonLabel?: string;
  buttonBackgroundHelp?: string;
  videoData?: TSplashPageVideoData;
  videoDataDemo?: TSplashPageVideoData;
  videoTilesTitle?: string;
  videoArr?: TVideoArrayItem[];
  exclusiveNft?: TExclusiveNFtType;
  marketplaceDemoParams?: TParamsMarketplaceDemo;
  subtitle?: string;
  textBottom?: boolean;
  timelinePics?: string[];
  tilesTitle?: string | null;
  videoPlayerParams?: TParamsMarketplaceDemo;
  counterData?: TCounterData;
  customStyle?: React.CSSProperties;
  counterOverride?: boolean;
  buttonBackgroundHelpText?: string;
  videoBackground1?: string;
};

export interface IAuthorCard {
  splashData: TSplashDataType;
  connectUserData?: () => Promise<void>;
  toggleCheckList?: () => void;
  whatSplashPage?: TWhatSplashPageType;
  customButtonBlock?: JSX.Element;
}

export interface IAuthorCardButton {
  buttonData: TSplashPageDataButtonType | undefined;
  whatSplashPage?: /*TWhatSplashPageType*/ string | undefined;
}

export type TWhatSplashPageType =
  | 'nftla-page'
  | 'about-page'
  | 'nftnyc-font'
  | 'genesis-font'
  | 'donation-square-button';

export interface IDefaultButtonBlock {
  splashData: TSplashDataType;
  connectUserData?: () => Promise<void>;
  whatSplashPage: TWhatSplashPageType | undefined;
}

export type TBackgroundColorObject = {
  darkTheme: string;
  lightTheme: string;
};

export interface IPurchaseChecklist {
  openCheckList: boolean;
  toggleCheckList: () => void;
  nameSplash: string;
  backgroundColor: TBackgroundColorObject;
}

export interface IAuthorBlock {
  children: React.ReactNode;
  mainClass: string;
}

export interface IButtonHelp {
  toggleCheckList: () => void;
  backgroundButton?: string;
  backgroundButtonText?: string;
}

export type TCowntdownObject = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export interface ICountdown {
  setTimerLeft?: any;
  time?: string;
}

export interface IVideoPlayerModule {
  backgroundImage: string;
  videoData?: TSplashPageVideoData;
  selectVideo?: any /*type of video is unclear yet*/;
}

export interface ICarouselModule {
  carousel: boolean;
  carouselTitle?: string;
  carouselData?: TCarouselDataType[];
}

export interface ICarouselItem {
  carouselItemTitle?: string;
  carouselItemImg: string;
  carouselDescription: string | null;
}

export interface ICarouselListItem {
  carouselItemTitle?: string;
  carouselItemImg: string;
  carouselDescription: string | null;
}

export interface IShowVideoToLoggedInUsers {
  backgroundImage: string;
  video?: string | null;
  videoTitle?: string;
  baseURL?: string;
  mediaId?: string;
  demo?: boolean;
  selectVideo: any /*type of video is unclear yet*/;
}

export interface INotCommercial {
  primaryColor: ColorChoice;
}

export interface ITokenLeftGreyman {
  primaryColor: ColorChoice;
  soldCopies?: string;
  copies?: string;
}

export interface ITeamComponentCommon {
  arraySplash?: TArraySplashType;
  readMoreCount?: number;
  setReadMoreCount?: (value: number) => void;
}

export type TSocialsItem = {
  classIcon: string;
  link: string;
  classLink?: string;
};

export type TTeamArrayItemType = {
  readMoreCountFlag?: number;
  chain?: string | null;
  nameTeammate: string;
  imageUrl: string;
  aboutTeammate: string[];
  socials?: TSocialsItem[];
};

export type TArraySplashType =
  | 'nipsey'
  | 'nftnyc'
  | 'ukraine'
  | 'vaporverse'
  | 'slidelock'
  | 'greyman'
  | 'immersiverse'
  | 'NFTLA'
  | 'rair'
  | 'rair-advisors'
  | 'rair-basic'
  | 'rair-basic-2'
  | 'bruce-fenton'
  | 'nuts'
  | 'coinagenda'
  | 'sim-dogs'
  | 'main-page'
  | 'wallstreet80sclub';

export interface ITeammate {
  url: string;
  name: string;
  desc: string[];
  primaryColor?: ColorChoice;
  socials?: TSocialsItem[];
  chain?: string | null;
  arraySplash?: TArraySplashType;
  readMoreCount?: number;
  setReadMoreCount?: (value: number) => void;
  readMoreCountFlag?: number;
}

export interface ITeammateDesc {
  desc: string[];
  primaryColor?: ColorChoice;
  arraySplash?: TArraySplashType;
  readMoreCount?: number;
  setReadMoreCount?: (value: number) => void;
  readMoreCountFlag?: number;
}

export interface INotCommercialGeneric {
  primaryColor: ColorChoice;
}

export interface ITokenLeft {
  primaryColor: ColorChoice;
  DiscordIcon: string;
  copies?: number;
  soldCopies?: number;
}

export interface IUnlockVideos {
  unlockableVideo: string;
  primaryColor: ColorChoice;
}

export type TVideoArrType = {
  typeVideo: string;
  unlockVideoName: string;
  timeVideo: string;
  locked: boolean;
};

export interface IUnlockVideoItem {
  nameVideo: string;
  timeVideo: string;
  unlockableVideo: string;
  primaryColor: ColorChoice;
}

export interface IExclusiveNft {
  Nft_1: string;
  Nft_2: string;
  Nft_3: string;
  Nft_4: string;
  NftImage: string;
  amountTokens: number;
  linkComing: string;
  titleNft?: string;
  colorText?: string;
}

export interface INipseyRelease {
  DiscordIcon: string;
}

export interface INotCommercialTemplate {
  primaryColor: ColorChoice;
  NFTName: string | undefined;
}

export interface ITeamMeetComponentCommon {
  teamArray: TTeamArrayItemType[];
  arraySplash?: TArraySplashType;
  className: boolean;
  readMoreCount?: number;
  setReadMoreCount?: (value: number) => void;
  readMoreCountFlag?: number;
}

export interface IPrivacyPolicyComponent {
  setIsSplashPage: (value: boolean) => void;
}

export interface ITermsUseComponent {
  setIsSplashPage: (value: boolean) => void;
}
export interface IInfoBlock {
  infoArray: string[];
  style?: React.CSSProperties;
  subclass?: string;
  children?: JSX.Element;
}

export interface IVaporverseSplashPage {
  connectUserData: () => Promise<void>;
  setIsSplashPage: (isSplashPage: boolean) => void;
}

export interface INFTImages {
  Nft_1: string;
  Nft_2: string;
  Nft_3: string;
  Nft_4: string;
  NftImage: string;
  amountTokens?: number;
  titleNft?: string;
  colorText?: string;
  carousel: boolean;
  noTitle?: boolean;
}

export interface ITokenLeftTemplate {
  primaryColor: ColorChoice;
  soldCopies: number;
  counterData?: TCounterData;
  ipftButton?: any; //type is unclear
  loginDone?: boolean;
  nftTitle?: string;
  counterOverride?: boolean;
}

export type TMainContractType = {
  contractAddress: string;
  requiredBlockchain: BlockchainType | undefined;
  offerIndex: string[];
};

export interface IModalHelp {
  openCheckList: boolean;
  purchaseList: boolean;
  togglePurchaseList: () => void;
  toggleCheckList?: () => void;
  backgroundColor: TBackgroundColorObject;
  templateOverride?: boolean;
}

export interface ICustomButtonBlock {
  splashData: TSplashDataType;
}

export type TButtonDataDonationGrid = {
  buttonAction: () => void;
  buttonTextColor: string;
  buttonColor: string;
  buttonLabel: string;
};

export type TDonationGridDataItem = {
  title: string;
  image: string;
  imageClass: string;
  buttonData: TButtonDataDonationGrid;
  textBoxArray: string[];
};

export interface IDonationGrid {
  donationGridArray: TDonationGridDataItem[];
}

export type TUseGetProductsReturn = [
  TFileType[],
  TFileType | undefined,
  (selectVideo: any) => void
];

export interface INotCommercialTemplate2 {
  primaryColor: ColorChoice;
  NFTName: string;
}

export interface IVideoWindow {
  mediaAddress: string;
}

export interface IVideoPlayerBySignature {
  mediaAddress: string;
}

export interface IWarningModal {
  className?: string;
  bad?: string;
  good?: string;
}
