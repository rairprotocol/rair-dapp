import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface IHeaderContainerStyled {
  isDarkMode: boolean;
  showAlert?: boolean;
  isSplashPage?: boolean;
  hotdrops?: string;
  realChainId?: string | undefined;
  secondaryColor?: string;
}

export const HeaderContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IHeaderContainerStyled>`
  background: ${({ isDarkMode, secondaryColor }) =>
    !isDarkMode ? '#fff' : `color-mix(in srgb, ${secondaryColor}, #888888)`};
  margin-top: ${(props) =>
    props.realChainId && props.showAlert && !props.isSplashPage ? '50px' : ''};
`;

export const SocialHeaderBox = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IHeaderContainerStyled>`
  border: 1px solid ${({ isDarkMode }) => (!isDarkMode ? '#9867D9' : '#fff')};
  background: ${({ isDarkMode }) => (!isDarkMode ? '#b2b2b2' : '')};
`;
