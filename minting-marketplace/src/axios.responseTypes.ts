import { TOfferType } from './components/marketplace/marketplace.types';
import { MediaListResponseType } from './components/video/video.types';
import { UserType } from './ducks/users/users.types';

export type TUserResponse = {
  success: boolean;
  user: UserType | null;
};

export type TNftItemResult = {
  totalCount: number;
  tokens: TTokenData[];
};

export type TAttributes = {
  trait_type: string;
  value: string;
};

export type TCheckMetadataOnBlockchain = {
  attributes?: TAttributes[];
  image: string;
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
  contract: string;
  creationDate: string;
  isMetadataPinned: boolean;
  isMinted: boolean;
  metadata: TMetadataType;
  metadataURI: string;
  offer: string;
  offerPool: string;
  ownerAddress: string;
  token: string;
  uniqueIndexInContract: string;
  _id: string;
};

export type TNftItemResponse = {
  success: boolean;
  result: TNftItemResult;
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

export type TFileType = {
  animatedThumbnail: string;
  author: string;
  authorPublicAddress: string;
  category: string;
  contract: string;
  creationDate: string;
  demo: boolean;
  description: string;
  duration: string;
  encryptionType: string;
  extension: string;
  isUnlocked: boolean;
  key: TFileKeyType;
  mainManifest: string;
  offer: string[];
  product: string;
  staticThumbnail: string;
  title: string;
  type: string;
  uri: string;
  _id: string;
};

export type TNftFilesResponse = {
  success: boolean;
  files: TFileType[];
};

export type IOffersResponseType = {
  success: boolean;
  product: INftProductType;
};

export type INftProductType = {
  collectionIndexInContract: string;
  contract: string;
  copies: number;
  cover: string;
  creationDate: string;
  diamond: boolean;
  firstTokenIndex: string;
  name: string;
  offers: INftProductOffers[];
  owner: string;
  royalty: number;
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
};

export type INftProductOffers = {
  contract: string;
  copies: number;
  creationDate: string;
  diamond: boolean;
  offerIndex: string;
  offerName: string;
  offerPool: string;
  price: string;
  product: string;
  range: string[];
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
};

export type TMediaList = {
  success: boolean;
  list: MediaListResponseType;
  totalNumber: number;
};

export type TGetFullContracts = {
  contracts: TContract[];
  success: boolean;
  totalNumber: number;
};

export type TContract = {
  blockchain: BlockchainType;
  contractAddress: string;
  creationDate: string;
  diamond: boolean;
  external: boolean;
  lastSyncedBlock: string;
  offerPool?: TOfferPool;
  products: TProducts;
  title: string;
  transactionHash?: string;
  user: string;
  _id: string;
};

export type TProducts = {
  collectionIndexInContract: string;
  contract: string;
  copies: number;
  cover: string;
  creationDate: string;
  diamond: boolean;
  firstTokenIndex: string;
  name: string;
  offers?: TOfferType[];
  royalty: number;
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
  // offerPool?: OfferPoolType;
  //owner?: string;
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

export type TTokenResponseData = {
  success: boolean;
  result: TTokenData;
};

export type TUploadSocket = {
  success: boolean;
  result: string;
};

export type TNftDataExternalLinkResultType = {
  contract: TContract;
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
