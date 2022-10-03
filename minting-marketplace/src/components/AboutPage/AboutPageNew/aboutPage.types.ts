import { ReactNode } from 'react';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';

export interface IAboutPageNew {
  headerLogoBlack?: string;
  headerLogoWhite?: string;
  setIsSplashPage: (arg: boolean) => void;
  connectUserData: () => void;
}

export interface IMainBlock {
  Metamask: string;
  primaryColor: ColorChoice;
  termsText: string;
  connectUserData: () => void;
  purchaseButton: ReactNode;
  RairLogo?: string;
}

export interface IStreamsAbout {
  Metamask: any;
  purchaseButton: ReactNode;
  primaryColor?: ColorChoice;
}

export interface IRoadMap {
  primaryColor: ColorChoice;
  RairLogo?: string;
}

export interface ILeftTokenAbout {
  primaryColor: ColorChoice;
}

export interface IRairOffer {
  primaryColor: ColorChoice;
}

export interface IMobileCarouselNfts {
  children: ReactNode;
  screen?: number;
}

export interface ICompareMobileSelect {
  categories: number;
}

export interface ITokenomics {
  Metamask: string;
}
