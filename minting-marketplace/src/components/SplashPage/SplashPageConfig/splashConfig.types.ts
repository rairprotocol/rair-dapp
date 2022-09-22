import { TSplashDataType } from '../splashPage.types';

export type TSplashPageMainBlock = TStyledSplashMainBlockWrapper & {
  children: React.ReactNode;
};

export interface ISplashPageWrapper {
  splashData?: TSplashDataType;
  loginDone?: boolean;
  connectUserData?: () => Promise<void>;
  setIsSplashPage?: (isSplashPage: boolean) => void;
  children: React.ReactNode;
}

export interface IMainBlockDescription {
  description?: string[] | string | null;
  marginTop: string;
  marginBottom: string;
}

//styled components types
export type TStyledMainBlockTitle = {
  color: string;
  fontSize: string;
  fontWeight: number | string;
  fontFamily: string;
  lineHeight: string;
  margin?: string;
  padding?: string;
  textAlign?: string;
  width?: string;
};

export type TStyledMainBlockDescription = {
  marginTop: string;
  marginBottom: string;
};

export type TStyledMainBlockTextContainer = {
  margin: string;
};

//component's props
export type TMainBlockInfoText = TStyledMainBlockTextContainer & {
  children?: React.ReactNode;
};

export type TMainTitleBlock = TStyledMainBlockTitle & {
  text?: string | string[];
};

export type TStyledHigherWrapperSplashPage = {
  fontFamily: string;
};

export type TDefaultThemeType = {
  colors: {
    mainBlock: string;
  };
  mobile: string;
};

export type TStyledSplashMainBlockWrapper = {
  widthDiff?: string;
  heightDiff?: string;
  bgColor?: string;
  borderRadius: string;
  backgroundImage?: string;
  paddingLeft: string;
};

export type TStyledImageBlock = {
  widthDiff: string;
  heightDiff: string;
  imageMargin: string;
};

export type TImageMainBlock = TStyledImageBlock & {
  image?: string;
};
