import { Hex } from 'viem';

export interface IListOfTokensComponent {
  blockchain?: Hex;
  contract: Hex | undefined;
  isOpen: boolean;
  handleIsOpen: () => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
  onClickItem: (element: string | undefined) => void;
  product: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
  selectedToken: string | undefined;
  setIsOpen: (isOpen: boolean) => void;
  serialNumberData: any;
}

export interface ICurrentTokensComponent {
  items: SelectNumberItem[];
  isBack?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsOpens?: (isOpens: boolean) => void;
  selectedToken: string | undefined;
  handleIsOpen: () => void;
  onClickItem: (element: string) => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
  totalCount?: any;
}

export type SelectNumberItem = {
  id: string;
  sold: boolean;
  token: string;
  value: string;
};

export interface ISelectNumber {
  blockchain: Hex | undefined;
  items: SelectNumberItem[];
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  selectedToken: string | undefined;
  serialNumberData: any;
  product: string | undefined;
  contract: Hex | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
}
export interface IMockUpPage {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}
