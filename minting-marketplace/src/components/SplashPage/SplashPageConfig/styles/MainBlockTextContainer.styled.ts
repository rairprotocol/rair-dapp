import styled from 'styled-components';
import {
  TStyledMainBlockDescription,
  TStyledMainBlockTextContainer,
  TStyledMainBlockTitle
} from '../splashConfig.types';

export const StyledMainBlockTextContainer = styled.div<TStyledMainBlockTextContainer>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: ${({ margin }) => margin};
  background-color: red;
`;

export const StyledMainBlockTitle = styled.div<TStyledMainBlockTitle>`
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  line-height: ${({ lineHeight }) => lineHeight};
  word-break: break-all;
  margin: ${({ textMargin }) => textMargin};
  padding: ${({ textPadding }) => textPadding};
`;

export const StyledMainBlockDescription = styled.div<TStyledMainBlockDescription>`
  width: 100%;
  margin-top: ${({ marginTop }) => marginTop};
  margin-bottom: ${({ marginBottom }) => marginBottom};
`;

export type TStyledWrapperSplashPage = {
  bgSize: string;
  bgPosition: string;
  wrapperHeight: string;
  bgColor: string;
  borderRadius: string;
};

export const StyledWrapperSplashPage = styled.div<TStyledWrapperSplashPage>`
  background-size: ${({ bgSize }) => bgSize};
  background-position: ${({ bgPosition }) => bgPosition};
  width: 100%;
  height: ${({ wrapperHeight }) => wrapperHeight};
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
