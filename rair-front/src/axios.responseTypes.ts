//@ts-nocheck
import { TOfferType } from './components/marketplace/marketplace.types';
import { MediaListResponseType } from './components/video/video.types';
import { CatalogItem } from './redux/tokenSlice';
import { CatalogVideoItem } from './types/commonTypes';
import { User } from './types/databaseTypes';

export type BackendResponse = {
  success: boolean;
  message: string;
};

export type TUserResponse = {
  success: boolean;
  user: User;
  message: string;
};

export type TAttributes = {
  trait_type: string;
  value: string;
  percentage: string;
};

export type TCheckMetadataOnBlockchain = {
  attributes?: TAttributes[];
  image: string;
  image_thumbnail?: string;
  name: string;
};
export type TMetadataType = TCheckMetadataOnBlockchain & {
  artist: string;
  description: string;
  external_url?: string;
  animation_url?: string;
};

export type TTokenData = {
  authenticityLink: string;
  blockchain?: string;
  contract: string;
  creationDate: string;
  isMetadataPinned: boolean;
  isMinted: boolean;
  isURIStoredToBlockchain: boolean;
  metadata: TMetadataType;
  metadataURI: string;
  offer: TOfferType;
  offerPool?: string;
  ownerAddress: string;
  token: string;
  uniqueIndexInContract: string;
  _id: string;
  resaleData?: any;
};

export type TNftItemResponse = {
  success: boolean;
  totalCount: number;
  tokens: TTokenData[];
};

export type TFavotiteTokenData = {
  token: TTokenData;
  userAddress: string;
  _id: string;
};

export type TDocData = {
  result: TFavotiteTokenData[];
};

export type TAxiosFavoriteData = {
  data: TDocData;
  status: string;
  results?: number;
};

export type TFileKeyType = {
  key: {
    data: number[];
    type: string;
  };
  authTag: {
    [key: string]: string;
  };
};

export type TNftFilesResponse = {
  success: boolean;
  files: CatalogVideoItem[];
};

export type IOffersResponseType = {
  success: boolean;
  product: TProducts;
};

export type TMediaList = {
  success: boolean;
  list: MediaListResponseType;
  totalNumber: number;
};

export type TGetFullContracts = {
  contracts: CatalogItem[];
  success: boolean;
  totalNumber: number;
};

export type TProducts = {
  collectionIndexInContract: string;
  contract: string;
  copies: number;
  cover: string;
  creationDate: string;
  diamond: boolean;
  firstTokenIndex: string;
  metadataURI: string;
  name: string;
  offers?: TOfferType[];
  owner?: string;
  royalty: number;
  singleMetadata: boolean;
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
  bannerImage?: string;
  // offerPool?: OfferPoolType;
};

export type TOfferPool = {
  contract: string;
  creationDate: string;
  marketplaceCatalogIndex: string;
  minterAddress?: string;
  product: string;
  rangeNumber: string;
  transactionHash: string;
  _id: string;
};

export type TAuthenticationType = {
  success: boolean;
  token: string;
};

export type TAuthGetChallengeResponse = {
  success: boolean;
  response: string;
};

export type TOnlySuccessResponse = {
  success: boolean;
  message?: string;
};

export type TMeetingInviteResponse = {
  success: boolean;
  invite?: {
    join_url: string;
    name: string;
  };
};

export type TTokenResponseData = {
  success: boolean;
  result: TTokenData;
};

export type TUploadSocket = {
  success: boolean;
  result: string;
};

export type TNftDataExternalLinkResultType = {
  contract: CatalogItem;
  tokens: TTokenData[];
  totalCount: number;
};

export type TNFTDataExternalLinkContractProduct = {
  success: boolean;
  result: TNftDataExternalLinkResultType;
};

export type TProductResponseType = {
  success: boolean;
  product: TProducts;
};
