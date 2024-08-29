import { tokenNumberData } from '../../../types/commonTypes';

export interface IListOfTokensComponent {
  isOpen: boolean;
  handleIsOpen: () => void;
  numberRef: React.LegacyRef<HTMLDivElement> | undefined;
  onClickItem: (element: string | undefined) => void;
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
  handleClickToken: (tokenId: string | undefined) => Promise<void>;
  setSelectedToken: (tokenId: string | undefined) => void;
  serialNumberData: Array<tokenNumberData>;
}
export interface IMockUpPage {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}
