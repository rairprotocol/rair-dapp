import { TMetadataType } from './../../../axios.responseTypes';
import { TNftDataItem } from '../../../ducks/nftData/nftData.types';
import { UserType } from '../../../ducks/users/users.types';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';

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
  primaryColor: ColorChoice;
  totalPageForPagination: number | undefined;
  whatPage: TWhatPage;
}
