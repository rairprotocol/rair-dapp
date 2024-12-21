import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import {
  IAppContainerFluidStyled,
  IMainBlockAppStyled
} from './AppContainer.types';

export const AppContainerFluid = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IAppContainerFluidStyled>`
  background-size: 100vw 100vh;
  min-height: 100vh;
  position: relative;
  background-color: ${({ isDarkMode, backgroundImage, primaryColor }) =>
    !isDarkMode ? '#000' : backgroundImage === '' ? '#000' : primaryColor};
  color: ${(props) => props.textColor};
  // background-image: url(${(props) => props.backgroundImage});
  background-position: center top;
  background-repeat: no-repeat;
  overflow: hidden;

  a {
    color: ${(props) => (props.primaryColor === '#dedede' ? '#000' : '#fff')};
  }

  @media screen and (max-width: 1024px) {
    background-size: contain;
  }
`;

export const MainBlockApp = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IMainBlockAppStyled>`
  margin-top: ${(props) =>
    props.showAlert && !props.isSplashPage ? '65px' : '0'};

  @media screen and (max-width: 1024px) {
    margin-top: 8vh;
  }

  @media screen and (max-width: 845px) {
    margin-top: ${(props) => (props.showAlert ? '120px' : '100px')};
  }
`;
