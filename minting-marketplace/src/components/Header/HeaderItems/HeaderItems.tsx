import styled from 'styled-components';

import { ColorChoice } from '../../../ducks/colors/colorStore.types';

interface IHeaderContainerStyled {
  primaryColor: ColorChoice;
  showAlert?: boolean;
  selectedChain?: string | null;
  isSplashPage?: boolean;
  hotdrops?: string;
}

export const HeaderContainer = styled.div<IHeaderContainerStyled>`
  background: ${(props) =>
    props.primaryColor === 'rhyno'
      ? '#fff'
      : `${
          props.hotdrops && props.hotdrops === 'true' ? '#0a0a0a' : '#383637'
        }`};
  margin-top: ${(props) =>
    props.showAlert && props.selectedChain && !props.isSplashPage
      ? '50px'
      : ''};
`;

export const SocialHeaderBox = styled.div<IHeaderContainerStyled>`
  border: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#9867D9' : '#fff')};
  background: ${(props) => (props.primaryColor === 'rhyno' ? '#b2b2b2' : '')};
`;
