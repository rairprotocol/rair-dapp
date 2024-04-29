export interface IListOfTokensComponent {
  blockchain: BlockchainType | undefined;
  contract: string | undefined;
  isOpen: boolean;
  handleIsOpen: () => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
  onClickItem: (element: string | undefined) => void;
  product: string | undefined;
  primaryColor: string;
  setSelectedToken: (tokenId: string | undefined) => void;
  selectedToken: string | undefined;
  setIsOpen: (isOpen: boolean) => void;
  totalCount: number | undefined;
}

export interface ICurrentTokensComponent {
  primaryColor: string;
  items: SelectNumberItem[];
  isBack?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsOpens?: (isOpens: boolean) => void;
  selectedToken: string | undefined;
  handleIsOpen: () => void;
  onClickItem: (element: string) => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
}

export type SelectNumberItem = {
  id: string;
  sold: boolean;
  token: string;
  value: string;
};

export interface ISelectNumber {
  blockchain: BlockchainType | undefined;
  items: SelectNumberItem[];
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  selectedToken: string | undefined;
  totalCount: number | undefined;
  product: string | undefined;
  contract: string | undefined;
  setSelectedToken: (tokenId: string | undefined) => void;
}
export interface IMockUpPage {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}
