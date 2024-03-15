import { UserType } from '../../ducks/users/users.types';

import { TMetadataType } from './../../axios.responseTypes';

export type TNftDataItem = {
  blockchain: BlockchainType | undefined;
  contract: string;
  operator: string;
  status: string;
  tokenId: string;
  price: string;
  tradeid: string;
  _id: string;
};

export interface INftItemComponent {
  blockchain: BlockchainType | undefined;
  contract: string;
  operator: string;
  status: string;
  tokenId: string;
  price: string;
  tradeid: string;
  _id: string;
}

export type TSortChoice = 'down' | 'up';

export interface IListOffersComponent {
  data: TNftDataItem[] | null;
  titleSearch: string;
}

export interface ISvgKey {
  color: string;
  bgColor: string;
  mobile?: boolean;
}

export type TEmbeddedParamsType = {
  contract: string;
  product: string;
  mode: 'collection' | 'tokens';
  setMode: (mode: string) => void;
  tokenId: string;
  setTokenId: (tokenId: string) => void;
};

export interface INftItemForCollectionView {
  embeddedParams: TEmbeddedParamsType;
  blockchain: BlockchainType | undefined;
  pict: string;
  price: string;
  offerPrice: string[];
  index: string;
  metadata: TMetadataType;
  offer: string;
  selectedData: TMetadataType;
  someUsersData: UserType;
  userName: string;
  tokenDataLength: number;
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
  primaryColor: string;
  totalPageForPagination: number | undefined;
  whatPage: TWhatPage;
}
