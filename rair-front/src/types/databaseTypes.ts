import { Hex } from 'viem';

export interface MongoDocument {
  _id?: string;
  _v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaFile extends MongoDocument {
  uploader: Hex;
  hidden: boolean;
  ageRestricted?: boolean;
  title: string;
  description: string;
  duration: string;
  type: string;
  extension: string;
  meetingId: string;
  encryptionType: string;
  // mainManifest: string;
  storage?: string;
  storagePath?: string;
  staticThumbnail: string;
  animatedThumbnail?: string;
  category?: string;
  demo: boolean;
  views?: number;
  totalEncryptedFiles?: number;
}

export interface Contract extends MongoDocument {
  title: string;
  user: string;
  blockchain: Hex;
  contractAddress: string;
  diamond: boolean;
  creationDate: string;
  transactionHash?: string;
  lastSyncedBlock: string;
  external: boolean;
  singleMetadata: boolean;
  metadataURI: string;
  importedBy: Hex;
  blockView: boolean;
  blockSync: boolean;
}

export interface Blockchain extends MongoDocument {
  hash: Hex;
  name: string;
  display?: boolean;
  sync?: boolean;

  diamondFactoryAddress?: string;
  classicFactoryAddress?: string;
  diamondMarketplaceAddress?: string;
  mainTokenAddress?: string;
  licenseExchangeAddress?: string;

  rpcEndpoint?: string;
  blockExplorerGateway?: string;
  alchemySupport: boolean;

  numericalId?: number;
  testnet?: boolean;
  symbol?: string;
}

export interface Category extends MongoDocument {
  name: string;
  files: number;
}

export interface FavoriteToken extends MongoDocument {
  userAddress: Hex;
  token: string;
}

export interface Product extends MongoDocument {
  name: string;
  collectionIndexInContract: string;
  contract: string;
  copies: number;
  soldCopies: number;
  sold: boolean;
  royalty: number;
  firstTokenIndex: string;
  cover: string;
  creationDate: string;
  transactionHash?: string;
  diamond: boolean;
  singleMetadata: boolean;
  metadataURI: string;
  bannerImage?: string;
}

export interface User extends MongoDocument {
  email?: string;
  nickName?: string;
  avatar?: string;
  background?: String;
  firstName?: string;
  lastName?: string;
  ageVerified?: boolean;
  publicAddress?: Hex;
  creationDate?: string;
  blocked?: boolean;
}

export interface MetadataAttribute {
  display_type?: string;
  trait_type?: string;
  value?: string;
  percentage?: string;
}

export interface TokenMetadata {
  image: string;
  image_thumbnail?: string;
  image_data?: string;
  artist?: string;
  external_url?: string;
  description: string;
  name: string;
  attributes?: Array<MetadataAttribute>;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}

export interface MintedToken extends MongoDocument {
  token: string;
  uniqueIndexInContract: string;
  ownerAddress: string;
  offerPool?: string;
  offer: string;
  contract: string;
  metadata: TokenMetadata;
  metadataURI: string;
  authenticityLink: string;
  isMinted: boolean;
  isMetadataPinned: boolean;
  isURIStoredToBlockchain: boolean;
  creationDate: string;
  product: string;
}

export interface Offer extends MongoDocument {
  offerIndex?: string;
  contract: string;
  product: string;
  offerPool?: string;
  copies?: number;
  allowedCopies?: number;
  lockedCopies?: number;
  soldCopies?: number;
  sold?: boolean;
  price: string;
  range: Array<string>;
  offerName?: string;
  creationDate?: string;
  diamond: boolean;
  diamondRangeIndex?: string;
  transactionHash?: string;
  hidden?: boolean;
  sponsored?: boolean;
}

export interface CustomValue {
  name: string;
  value: string;
}
export interface FooterLink {
  label: string;
  url: string;
}
export interface ServerSettings extends MongoDocument {
  onlyMintedTokensResult: boolean;
  demoUploadsEnabled: boolean;
  featuredCollection?: { _id: string; contract: string };
  nodeAddress: string;
  superAdmins?: Array<Hex>;
  superAdminsOnVault?: boolean;
  databaseResales?: boolean;
  darkModePrimary?: string;
  darkModeSecondary?: string;
  darkModeText?: string;
  darkModeBannerLogo?: string;
  darkModeMobileLogo?: string;
  lightModeBannerLogo?: string;
  lightModeMobileLogo?: string;
  buttonPrimaryColor?: string;
  buttonFadeColor?: string;
  buttonSecondaryColor?: string;
  iconColor?: string;
  footerLinks?: Array<FooterLink>;
  legal?: string;
  favicon?: string;
  signupMessage?: string;
  customValues?: Array<CustomValue>;
}

export interface ResaleData extends MongoDocument {
  tokenContract: string;
  tokenIndex: string;
  price: string;
  buyer?: Hex;
  seller: Hex;
  blockchainOfferId?: string;
}
