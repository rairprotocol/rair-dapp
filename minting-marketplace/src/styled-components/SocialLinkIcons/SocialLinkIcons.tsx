import styled from 'styled-components';

import { ColorChoice } from '../../ducks/colors/colorStore.types';

interface ISocialBox {
  width?: string;
  height?: string;
  primaryColor?: ColorChoice;
  marginRight?: string;
  marginLeft?: string;
  hoverColor?: string;
  activeSearch?: boolean;
  messageAlert?: string | null;
  avatar?: string | null | undefined;
  onClick?: any;
}

export const SocialBox = styled.div<ISocialBox>`
  width: ${(props) => (props.width ? props.width : '32px')};
  height: ${(props) => (props.height ? props.height : '32px')};
  border-radius: 10.5px;
  border: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#D0D0D0' : '#fff')};

  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  &.social-sun-icon {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? '#383637' : '#fff'};
    border: ${(props) =>
      props.primaryColor === 'rhyno' ? '1px solid #E882D5' : 'none'};
  }

  &.social-bell-icon {
    background: none;
    border: ${(props) =>
      props.primaryColor === 'rhyno' ? '1px solid #fff' : '1px solid #D0D0D0'};
  }

  &.social-sun-icon:hover {
    border: ${(props) =>
      props.primaryColor === 'rhyno'
        ? '1px solid #383637'
        : '1px solid #E882D5'};

    svg path {
      fill: none;
    }
  }

  a {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    border: 1px solid ${(props) => props.hoverColor};
    background: ${(props) => props.hoverColor};
    transition: all 0.2s ease;
    cursor: pointer;

    svg path {
      fill: #fff;
    }
  }
`;

export const SocialBoxSearch = styled.div<ISocialBox>`
  width: 40px;
  height: 40px;
  border-radius: 10.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.activeSearch
      ? 'var(--stimorol)'
      : props.primaryColor === 'rhyno'
      ? '#ffffff'
      : '#424242'};
  border: ${(props) => (props.activeSearch ? 'none' : '1px solid #eaeaea')};
  cursor: pointer;
  transition: all 0.2s ease;

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  &:hover {
    border: none;
    background: var(--stimorol);
    i {
      color: #fff;
    }
  }

  i {
    color: ${(props) => (props.activeSearch ? '#fff' : '#bd6bae')};
    font-size: 18px;
    font-weight: 400;
    transition: all 0.3s ease;
  }
`;

export const UserIconMobile = styled.div<ISocialBox>`
  width: 40px;
  height: 40px;
  border-radius: 10.5px;
  background: ${(props) =>
    props.avatar ? 'url(' + props.avatar + ') no-repeat' : 'var(--royal-ice)'};
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: ${(props) =>
    props.messageAlert === 'profile' && props.primaryColor === 'rhyno'
      ? '1px solid #000'
      : props.messageAlert === 'profile'
      ? '1px solid #D0D0D0'
      : 'none'};

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};
`;

export const SocialMenuMobile = styled.div<ISocialBox>`
  cursor: pointer;
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? '#fff' : '#424242'};
  border: 0.7px solid #eaeaea;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
