import styled from 'styled-components';

import {
  TStyledSplashCardImage,
  TStyledSplashPageCardWrapper
} from '../splashConfig.types';

export const StyledSplashPageCardWrapper = styled.div<TStyledSplashPageCardWrapper>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  width: 100%;
  height: auto;
  @media (max-width: 930px) {
    flex-direction: column-reverse;
    border-radius: 16px;
  } ;
`;

export const StyledSplashCardImage = styled.img<TStyledSplashCardImage>`
  width: 100%;
  height: auto;
  min-width: 400px;
  margin: ${({ imageMargin }) => imageMargin};

  @media (max-width: 930px) {
    margin: 0px;
    padding: 5px;
    border-radius: 0px;
    min-width: 100%;
  }
`;
