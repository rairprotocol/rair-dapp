import React from 'react';

import { TUnlockableVideosSingleTokenPage } from '../../MockUpPage/mockupPage.types';
import { TSplashDataType } from '../splashPage.types';

export type TSplashPageCardWrapper = TStyledSplashPageCardWrapper & {
  children: React.ReactNode;
};

export interface ISplashPageWrapper {
  splashData?: TSplashDataType;
  connectUserData?: () => Promise<void>;
  setIsSplashPage?: (isSplashPage: boolean) => void;
  children: React.ReactNode;
}

export interface IMainBlockDescription {
  description?: string[] | string | null;
  marginTop: string;
  marginBottom: string;
}

export type TStyledSplashCardText = {
  color: string;
  fontSize: string;
  fontWeight: number | string;
  fontFamily: string;
  lineHeight: string;
  marginBottom?: string;
  padding?: string;
  textAlign?: string;
  width?: string;
  mediafontSize?: string;
};

export type TStyledMainBlockDescription = {
  marginTop: string;
  marginBottom: string;
};

export type TStyledSplashCardInfoBlock = {
  paddingLeft?: string;
};

//component's props
export type TSplashCardInfoBlock = TStyledSplashCardInfoBlock & {
  children?: React.ReactNode;
};

export type TSplashCardText = TStyledSplashCardText & {
  text?: string | React.ReactNode;
};

export type TStyledHigherWrapperSplashPage = {
  fontFamily: string;
};

export type TDefaultThemeType = {
  colors: {
    mainBlock: string;
    dark: string;
  };
  mobile: string;
};

export type TStyledSplashPageCardWrapper = {
  bgColor?: string;
  height?: string;
};

export type TStyledSplashCardImage = {
  widthDiff?: string;
  heightDiff?: string;
  imageMargin?: string;
};

export type TSplashCardImage = TStyledSplashCardImage & {
  image?: string;
};

export type TFlexDirection =
  | 'column'
  | 'column-reverse'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'row'
  | 'row-reverse'
  | 'unset';

export type TJustifyContent =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type TAlignItems =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'stretch'
  | 'baseline';

export type TFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type TStyledSplashCardButtonsWrapper = {
  height?: string;
  width?: string;
  marginTop?: string;
  gap?: string;
  flexDirection?: TFlexDirection;
  justifyContent?: TJustifyContent;
  flexWrap?: TFlexWrap;
  margin?: string;
};

export type TSplashCardButtonsWrapper = TStyledSplashCardButtonsWrapper & {
  children: React.ReactNode;
};

export type TSplashCardButton = TStyledSplashCardButton & {
  buttonLabel?: string;
  buttonImg?: string | null;
  buttonAction?: () => void;
  className: string;
};

export type TStyledSplashCardButton = {
  width?: string | number;
  borderRadius?: string | number;
  margin?: string | number;
  padding?: string | number;
  height?: string | number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontSize?: string | number;
  lineHeight?: string | number;
  background?: string | number;
  color?: string;
  border?: string;
  flexGrow?: number;
};

export type TStyledButtonMainBlockWrapper = {
  flexDirection?: TFlexDirection;
  justifyContent?: TJustifyContent;
  height: string;
};

export type TButtonMainBlockWrapper = TStyledButtonMainBlockWrapper & {
  children: React.ReactNode;
};

export type TSplashVideoWrapper = {
  children: React.ReactNode;
  className?: string;
};

export type TUnlockableVideosWrapper = TUnlockableVideosSingleTokenPage;

export type TStyledUnlockableVideosWrapper = {
  primaryColor: string;
};

export type TSplashVideoText = {
  text: string;
  className: string;
};

export type TSplashVideoTextBlock = {
  children: React.ReactNode;
  className?: string;
};
