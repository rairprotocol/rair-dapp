import styled from 'styled-components';

import {
  TStyledImageBlock,
  TStyledSplashMainBlockWrapper
} from '../splashConfig.types';

export const StyledSplashMainBlockWrapper = styled.div<TStyledSplashMainBlockWrapper>`
  display: flex;
  justify-content: 'space-between';
  align-items: 'center';
  border-radius: ${({ borderRadius }) => borderRadius || '24px'};
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  width: '100%';
  height: '42vw';
  /* background-color: red; */
  @media (max-width: 930px) {
    flex-direction: column-reverse;
    border-radius: 16px;
  } ;
`;

export const StyledImageBlock = styled.img<TStyledImageBlock>`
  width: 100%;
  min-width: 400px;
  height: auto;
  margin: ${({ imageMargin }) => imageMargin};

  @media (max-width: 930px) {
    min-width: 100%;
    margin: 0px;
    padding: 3px;
    border-radius: 0px;
  }
`;
