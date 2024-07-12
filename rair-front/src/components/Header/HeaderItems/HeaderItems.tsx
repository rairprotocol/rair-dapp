import styled from 'styled-components';

interface IHeaderContainerStyled {
  primaryColor: string;
  showAlert?: boolean;
  selectedChain?: string | null;
  isSplashPage?: boolean;
  hotdrops?: string;
  realChainId?: string | undefined;
  secondaryColor?: string;
}

export const HeaderContainer = styled.div<IHeaderContainerStyled>`
  background: ${(props) =>
    props.primaryColor === '#dedede'
      ? '#fff'
      : `color-mix(in srgb, ${props.secondaryColor}, #888888)`};
  margin-top: ${(props) =>
    props.realChainId &&
    props.showAlert &&
    !props.selectedChain &&
    !props.isSplashPage
      ? '50px'
      : ''};
`;

export const SocialHeaderBox = styled.div<IHeaderContainerStyled>`
  border: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#9867D9' : '#fff')};
  background: ${(props) => (props.primaryColor === 'rhyno' ? '#b2b2b2' : '')};
`;
