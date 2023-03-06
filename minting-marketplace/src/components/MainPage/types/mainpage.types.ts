export type TUseGetProductsGeneralArguments = {
  blockchain: BlockchainType;
  contract: string;
  product: string;
  currentUserAddress: string | undefined;
};

export interface IMainPage {
  loginDone: boolean;
  setIsSplashPage: (arg: boolean) => void;
  connectUserData: () => void;
  seoInformation: Object;
}
