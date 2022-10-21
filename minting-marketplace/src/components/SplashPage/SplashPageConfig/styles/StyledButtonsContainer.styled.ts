import styled from 'styled-components';

import {
  TStyledButtonMainBlockWrapper,
  TStyledSplashCardButton,
  TStyledSplashCardButtonsWrapper
} from '../splashConfig.types';

export const StyledSplashCardButtonsWrapper = styled.div<TStyledSplashCardButtonsWrapper>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  flex-wrap: ${({ flexWrap }) => flexWrap || 'nowrap'};
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height};
  margin-top: ${({ marginTop }) => marginTop || '0px'};
  gap: ${({ gap }) => gap};

  @media (max-width: 930px) {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
`;

export const StyledSplashCardButton = styled.button<TStyledSplashCardButton>`
  flex-grow: ${({ flexGrow }) => flexGrow || 0};
  width: ${({ width }) => width};
  max-width: 100%;
  border-radius: ${({ borderRadius }) => borderRadius || '0'};
  height: ${({ height }) => height || '100%'};
  margin: ${({ margin }) => margin || '0px'};
  padding: ${({ padding }) => padding || '0px'};
  font-family: ${({ fontFamily }) => fontFamily};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-size: ${({ fontSize }) => fontSize};
  line-height: ${({ lineHeight }) => lineHeight};
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  border: ${({ border }) => border || 'none'};
`;

export const StyledButtonImage = styled.img`
  width: 41px;
  height: 41px;
  margin-right: 33px;

  @media (max-width: 930px) {
    margin-right: 8px;
  }
`;

export const StyledButtonMainBlockWrapper = styled.div<TStyledButtonMainBlockWrapper>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  height: ${({ height }) => height};
  width: 100%;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
`;
