import styled from 'styled-components';

import { TStyledSplashCardButtonsWrapper } from '../../splashConfig.types';

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
