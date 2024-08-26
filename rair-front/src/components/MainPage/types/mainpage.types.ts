import { Hex } from 'viem';

export type TUseGetProductsGeneralArguments = {
  blockchain: Hex;
  contract: string;
  product: string;
  currentUserAddress: string | undefined;
};

export interface IMainPage {
  setIsSplashPage: (arg: boolean) => void;
  setIsAboutPage: (arg: boolean) => void;
}
