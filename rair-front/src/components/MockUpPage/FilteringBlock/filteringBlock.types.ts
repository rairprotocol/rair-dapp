import { TDiamondTokensType } from '../../nft/nft.types';

export interface IFilteringBlock {
  primaryColor: string;
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
  secondaryColor?: string;
};

export type TFiltersTitleIconStyled = {
  filterPopUp: boolean;
  className?: string;
  primaryColor: string;
  textColor?: string;
  customSecondaryButtonColor?: string;
};

export type TSelectFiltersPopUpStyled = {
  primaryColor: string;
};

export type TSelectSortItemStyled = {
  primaryColor: string;
  textColor?: string;
  sortPopUp: boolean;
  secondaryColor: string;
};

export type TSortArrowUpIconStyled = {
  sortItem?: TSortChoice;
  primaryColor: string;
  textColor?: string;
  customSecondaryButtonColor?: any;
};

export type TSelectSortPopUpStyled = {
  primaryColor: string;
  textColor?: string;
};

export type TModalContentPictureStyled = {
  picture: string;
  primaryColor: string;
  defaultImg: string;
};

export type TStyledShevronIconStyled = {
  rotate?: string;
  primaryColor: string;
  textColor?: string;
  customSecondaryButtonColor?: string;
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
  | 'Sepolia Testnet'
  // | 'Binance Testnet'
  // | 'Binance Mainnet'
  | 'Ethereum Mainnet'
  | 'Astar Mainnet';

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
  setIsCreatedTab: (value: boolean) => void;
  selectedData: TDiamondTokensType | undefined;
  defaultImg: string;
  primaryColor: string;
  isCreatedTab: boolean;
}

export interface IBlockMinMax {
  clearAll: boolean;
}
