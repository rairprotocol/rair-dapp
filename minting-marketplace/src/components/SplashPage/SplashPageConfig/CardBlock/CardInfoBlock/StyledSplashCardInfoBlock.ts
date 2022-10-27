import styled from 'styled-components';

import { TStyledSplashCardInfoBlock } from '../../splashConfig.types';

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
