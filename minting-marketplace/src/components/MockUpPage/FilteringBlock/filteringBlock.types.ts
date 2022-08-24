import { TDiamondTokensType } from '../../nft/nft.types';
import { ColorChoice } from './../../../ducks/colors/colorStore.types';
export interface IFilteringBlock {
  primaryColor: ColorChoice;
  textColor?: string;
  sortItem: TSortChoice | undefined;
  setSortItem: (item: TSortChoice) => void;
  isFilterShow: boolean;
  setBlockchain?: (blockchain: BlockchainType | undefined) => void;
  setCategory?: (category: TOnClickCategories | null) => void;
  setIsShow?: (value: boolean) => void;
  setIsShowCategories?: (value: boolean) => void;
  setFilterText?: (name: TBlockchainNames) => void;
  setFilterCategoriesText?: (name: TOnClickCategories) => void;
  categoryClick?: TOnClickCategories | null;
  setCategoryClick?: (value: TOnClickCategories | null) => void;
  blockchainClick?: TBlockchainNames | null;
  setBlockchainClick?: (value: TBlockchainNames | null) => void;
}

export type TSortChoice = 'down' | 'up';

export type TOnClickCategories = 'Science' | 'Music' | 'Conference' | 'Art';

export type TFilterItemCategories = 'Price' | 'Metadata';

export interface IArrowUp {
  className?: string;
}

export type TSelectFiltersItemStyled = {
  primaryColor: string;
  filterPopUp: boolean;
  textColor?: string;
};

export type TFiltersTitleIconStyled = {
  filterPopUp: boolean;
  className?: string;
};

export type TSelectFiltersPopUpStyled = {
  primaryColor: ColorChoice;
};

export type TSelectSortItemStyled = {
  primaryColor: ColorChoice;
  textColor?: string;
  sortPopUp: boolean;
};

export type TSortArrowUpIconStyled = {
  sortItem?: TSortChoice;
};

export type TSelectSortPopUpStyled = {
  primaryColor: ColorChoice;
  textColor?: string;
};

export type TModalContentPictureStyled = {
  picture: string;
  primaryColor: ColorChoice;
  defaultImg: string;
};

export type TStyledShevronIconStyled = {
  rotate?: string;
};

export type TModalCategoriesItem = {
  name: TOnClickCategories;
  clicked: boolean;
};

export interface IModalCategories {
  setFilterCategoriesText?: (name: TOnClickCategories) => void;
  setIsOpenCategories: (value: boolean) => void;
  isOpenCategories: boolean;
  setCategory?: (category: TOnClickCategories | null) => void;
  setIsShowCategories?: (value: boolean) => void;
  click?: TOnClickCategories | null;
  setClick?: (clickItem: TOnClickCategories | null) => void;
}

export type TBlockchainNames =
  | 'Matic Mainnet'
  | 'Matic Testnet'
  | 'Goerli Testnet'
  | 'Binance Testnet'
  | 'Binance Mainnet'
  | 'Ethereum Mainnet';

export type TBlockchainCategory = {
  name: TBlockchainNames;
  chainId: BlockchainType;
  clicked: boolean;
};

export interface IModalBlockchain {
  setBlockchain?: (blockchain: BlockchainType | undefined) => void;
  isOpenBlockchain: boolean;
  setIsOpenBlockchain: (value: boolean) => void;
  setIsShow?: (value: boolean) => void;
  setFilterText?: (name: TBlockchainNames) => void;
  click?: TBlockchainNames | null;
  setClick?: (value: TBlockchainNames | null) => void;
}

export interface IPortal {
  children: JSX.Element;
  parent?: HTMLDivElement;
  className?: string;
}

export interface IModal {
  open: boolean;
  children: JSX.Element;
  onClose: () => void;
  locked?: boolean;
}

export interface IModalItem {
  isOpenBlockchain: boolean;
  setIsOpenBlockchain: (value: boolean) => void;
  selectedData: TDiamondTokensType | undefined;
  defaultImg: string;
  primaryColor: ColorChoice;
}

export interface IBlockMinMax {
  clearAll: boolean;
}
