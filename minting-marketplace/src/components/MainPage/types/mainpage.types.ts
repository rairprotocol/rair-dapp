export type TUseGetProductsGeneralArguments = {
  blockchain: BlockchainType;
  contract: string;
  product: string;
  currentUserAddress: string | undefined;
};

export interface IMainPage {
  setIsSplashPage: (arg: boolean) => void;
  connectUserData: () => void;
  seoInformation: Object;
  setIsAboutPage: (arg: boolean) => void;
}
