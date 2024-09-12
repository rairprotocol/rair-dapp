import { ContractType } from '../adminViews/adminView.types';

export interface IMainHeader {
  goHome: () => void;
  renderBtnConnect: boolean;
  creatorViewsDisabled: boolean;
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
