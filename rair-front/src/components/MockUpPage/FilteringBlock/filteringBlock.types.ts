import { Hex } from 'viem';

import { TDiamondTokensType } from '../../nft/nft.types';

export interface IFilteringBlock {
  primaryColor: string;
  textColor?: string;
  sortItem: TSortChoice | undefined;
  setSortItem: (item: TSortChoice) => void;
  isFilterShow: boolean;
  setBlockchain?: (blockchain: Hex | undefined) => void;
  setCategory?: (category: string | null) => void;
  setIsShow?: (value: boolean) => void;
  setIsShowCategories?: (value: boolean) => void;
  setFilterText?: (name: TBlockchainNames) => void;
  setFilterCategoriesText?: (name: string) => void;
  categoryClick?: string | null;
  setCategoryClick?: (value: string | null) => void;
  blockchainClick?: TBlockchainNames | null;
  setBlockchainClick?: (value: TBlockchainNames | null) => void;
}

export type TSortChoice = 'down' | 'up';

export type TFilterItemCategories = 'Price' | 'Metadata';

export interface IArrowUp {
  className?: string;
}

export type TSelectFiltersItemStyled = {
  primaryColor?: string;
  filterPopUp: boolean;
  textColor?: string;
  secondaryColor?: string;
};

export type TFiltersTitleIconStyled = {
  filterPopUp: boolean;
  className?: string;
  primaryColor?: string;
  textColor?: string;
  customSecondaryButtonColor?: string;
};

export type TSelectFiltersPopUpStyled = {
  primaryColor?: string;
};

export type TSelectSortItemStyled = {
  primaryColor?: string;
  textColor?: string;
  sortPopUp: boolean;
  secondaryColor?: string;
  isDarkMode?: boolean;
};

export type TSortArrowUpIconStyled = {
  sortItem?: TSortChoice;
  primaryColor?: string;
  textColor?: string;
  customSecondaryButtonColor?: any;
};

export type TSelectSortPopUpStyled = {
  isDarkMode?: boolean;
  primaryColor?: string;
  textColor?: string;
};

export type TModalContentPictureStyled = {
  picture: string;
  primaryColor: string;
  defaultImg: string;
};

export type TStyledShevronIconStyled = {
  rotate?: string;
  primaryColor?: string;
  textColor?: string;
  customSecondaryButtonColor?: string;
};

export type TModalCategoriesItem = {
  name: string;
  clicked: boolean;
};

export interface IModalCategories {
  setFilterCategoriesText?: (name: string) => void;
  setIsOpenCategories: (value: boolean) => void;
  isOpenCategories: boolean;
  setCategory?: (category: string | null) => void;
  setIsShowCategories?: (value: boolean) => void;
  click?: string | null;
  setClick?: (clickItem: string | null) => void;
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
  chainId: Hex;
  clicked: boolean;
};

export interface IModalBlockchain {
  setBlockchain?: (blockchain: Hex | undefined) => void;
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
  isCreatedTab: boolean;
}

export interface IBlockMinMax {
  clearAll: boolean;
}
