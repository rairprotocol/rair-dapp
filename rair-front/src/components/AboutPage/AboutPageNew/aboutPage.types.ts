import { ReactNode } from 'react';

export interface IAboutPageNew {
  headerLogoBlack?: string;
  headerLogoWhite?: string;
  setIsSplashPage: (arg: boolean) => void;
}

export interface IMainBlock {
  Metamask: string;
  primaryColor: string;
  termsText: string;
  purchaseButton: ReactNode;
  RairLogo?: string;
}

export interface IStreamsAbout {
  Metamask: any;
  purchaseButton: ReactNode;
  primaryColor?: string;
}

export interface IRoadMap {
  primaryColor: string;
  RairLogo?: string;
}

export interface ILeftTokenAbout {
  primaryColor: string;
}

export interface IRairOffer {
  primaryColor: string;
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
