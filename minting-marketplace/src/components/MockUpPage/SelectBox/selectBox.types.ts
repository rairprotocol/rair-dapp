import { TTokenData } from '../../../axios.responseTypes';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';

export interface IListOfTokensComponent {
  blockchain: BlockchainType | undefined;
  contract: string;
  isOpen: boolean;
  handleIsOpen: () => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
  onClickItem: (element: string) => void;
  product: string;
  primaryColor: ColorChoice;
  setSelectedToken: (tokenId: string) => void;
  selectedToken: string;
  setIsOpen: (isOpen: boolean) => void;
  totalCount: number;
}

export interface ICurrentTokensComponent {
  primaryColor: ColorChoice;
  items: TTokenData[] | SelectNumberItem[];
  isBack?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsOpens?: (isOpens: boolean) => void;
  selectedToken: string;
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
  handleClickToken: (tokenId: string) => Promise<void>;
  selectedToken: string;
  setSelectedToken: (selectedToken: string) => void;
  totalCount: number;
  product: string;
  contract: string;
}
export interface IMockUpPage {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}
