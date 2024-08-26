import { ReactNode } from 'react';

export interface IMainBlock {
  Metamask: string;
  termsText: string;
  purchaseButton: ReactNode;
  RairLogo?: string;
}

export interface IStreamsAbout {
  Metamask: any;
  purchaseButton: ReactNode;
  primaryColor?: string;
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
