import styled from 'styled-components';

import {
  TStyledSplashCardInfoBlock,
  TStyledSplashCardText
} from '../splashConfig.types';

export const StyledSplashCardInfoBlock = styled.div<TStyledSplashCardInfoBlock>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding-left: ${({ paddingLeft }) => paddingLeft || '0px'};
  height: 100%;

  @media (max-width: 930px) {
    width: 100%;
    padding: 15px;
    text-align: center;
  }
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
    margin-bottom: 2vw;
  }

  @media (max-width: 539px) {
    font-size: 20px;
  }
`;
