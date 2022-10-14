import styled from 'styled-components';

import {
  TStyledSplashCardInfoBlock,
  TStyledSplashCardText,
  TStyledWrapperSplashPage
} from '../splashConfig.types';

export const StyledSplashCardInfoBlock = styled.div<TStyledSplashCardInfoBlock>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ padding }) => padding || '0px'};
  height: 100%;
`;

export const StyledSplashCardText = styled.div<TStyledSplashCardText>`
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  line-height: ${({ lineHeight }) => lineHeight};
  word-break: break-word;
  margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
  padding: ${({ padding }) => padding || '0px'};
  text-align: ${({ textAlign }) => textAlign || 'start'};
  width: ${({ width }) => width || '100%'};

  @media (max-width: 930px) {
    font-size: ${({ mediafontSize }) => mediafontSize};
    width: 100%;
    text-align: center;
  }

  @media (max-width: 539px) {
    font-size: 20px;
  }
`;

export const StyledWrapperSplashPage = styled.div<TStyledWrapperSplashPage>`
  background-size: ${({ bgSize }) => bgSize};
  background-position: ${({ bgPosition }) => bgPosition};
  width: 100%;
  height: ${({ wrapperHeight }) => wrapperHeight};
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
