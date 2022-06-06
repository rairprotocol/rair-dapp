import { MediaListResponseType } from "./components/video/video.types";
import { UserType } from "./ducks/users/sagas";

export type TUserResponse = {
    success: boolean;
    user: UserType | null;
}

export type TMediaList = {
  success: boolean;
  list: MediaListResponseType;
}

export type TGetFullContracts = {
  contracts: TContract[];
  success: boolean;
  totalNumber: number;
}

export type TContract = {
  blockchain: BlockchainType;
  contractAddress: string;
  creationDate: string;
  diamond: boolean;
  external: boolean;
  lastSyncedBlock: string;
  offerPool: TOfferPool;
  products: TProducts;
  title: string;
  transactionHash?: string;
  user: string;
  _id: string;

}

export type TOffers = {
  contract: string;
  copies: number;
  creationDate: string;
  diamond: boolean;
  offerIndex: string;
  offerName: string;
  offerPool: string;
  price: number;
  product: string;
  range: string[];
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
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
    offers: TOffers[];
    royalty: number;
    sold: boolean;
    soldCopies: number;
    transactionHash: string;
    _id: string;
  }

  export type TOfferPool = {
    contract: string;
    creationDate: string;
    marketplaceCatalogIndex: string;
    minterAddress? : string;
    product: string;
    rangeNumber: string;
    transactionHash: string;
    _id: string;
  }

export type TAuthenticationType = {
    token: string;
}

export type TAuthGetChallengeResponse = {
    success: boolean;
    response: string;
}

export type TOnlySuccessResponse = {
    success: boolean;
}
