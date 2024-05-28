import { ContractType } from '../adminViews/adminView.types';

export interface IMainHeader {
  goHome: () => void;
  startedLogin: boolean;
  renderBtnConnect: boolean;
  connectUserData: () => void;
  creatorViewsDisabled: boolean;
  selectedChain: string | null;
  showAlert: boolean;
  isSplashPage: boolean;
  setTabIndexItems: (arg: number) => void;
  isAboutPage: boolean;
  setTokenNumber: (arg: number | undefined) => void;
  realChainId: string | undefined;
}

export type TAxiosCollectionData = {
  succuss: boolean;
  contract: TContractHeaderResponse;
};

export type TContractHeaderResponse = Omit<ContractType, 'diamond'>;
