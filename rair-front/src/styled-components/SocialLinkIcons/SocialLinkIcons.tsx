import styled from 'styled-components';

interface ISocialBox {
  width?: string;
  height?: string;
  primaryColor?: string;
  marginRight?: string;
  marginLeft?: string;
  hoverColor?: string;
  activeSearch?: boolean;
  messageAlert?: string | null;
  avatar?: string | null | undefined;
  onClick?: any;
  notification?: boolean;
  hotdrops?: string;
}

export const SocialBox = styled.div<ISocialBox>`
  width: ${(props) => (props.width ? props.width : '32px')};
  height: ${(props) => (props.height ? props.height : '32px')};
  border-radius: 10.5px;
  border: 1px solid
    ${(props) => (props.primaryColor === '#dedede' ? '#D0D0D0' : '#fff')};

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  span {
    width: 7px;
    height: 7px;
    background: red;
    position: absolute;
    top: 0px;
    right: 0;
    border-radius: 50%;
    background: #f63419;
  }

  &.social-sun-icon {
    background: ${(props) =>
      props.primaryColor === '#dedede' ? '#383637' : '#fff'};
    border: ${(props) =>
      props.primaryColor === '#dedede' ? '1px solid #E882D5' : 'none'};
  }

  &.social-bell-icon.notifications {
    .red-circle-notifications {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: red;
      position: absolute;
      top: -7px;
      right: -7px;
      display: block;
    }
  }

  &.social-bell-icon {
    background: none;
    border: ${(props) =>
      props.primaryColor === '#dedede'
        ? '1px solid #fff'
        : '1px solid #D0D0D0'};

    .red-circle-notifications {
      display: none;
    }

    svg path {
      fill: ${(props) =>
        props.notification
          ? props.primaryColor === '#dedede'
            ? '#383637'
            : '#fff'
          : 'none'};
    }
  }

  &.social-sun-icon:hover {
    border: ${(props) =>
      props.primaryColor === '#dedede'
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

  @media screen and (max-width: 400px) {
    width: 35px;
    height: 35px;
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
      ? props.hotdrops === 'true'
        ? 'var(--hot-drops-gradient)'
        : 'var(--stimorol)'
      : props.primaryColor === '#dedede'
        ? '#ffffff'
        : '#424242'};
  border: ${(props) => (props.activeSearch ? 'none' : '1px solid #eaeaea')};
  cursor: pointer;
  transition: all 0.2s ease;

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  &:hover {
    border: none;
    background: ${(props) =>
      props.hotdrops === 'true' ? 'var(--hot-drops-hover)' : 'var(--stimorol)'};
    i {
      color: #fff;
    }
  }

  i {
    color: ${(props) =>
      props.activeSearch
        ? '#fff'
        : `${props.hotdrops === 'true' ? 'var(--hot-drops)' : '#bd6bae'}`};
    font-size: 18px;
    font-weight: 400;
    transition: all 0.3s ease;
  }

  @media screen and (max-width: 400px) {
    width: 35px;
    height: 35px;
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
    props.messageAlert === 'profile' && props.primaryColor === '#dedede'
      ? '1px solid #000'
      : props.messageAlert === 'profile'
        ? '1px solid #D0D0D0'
        : 'none'};

  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};

  @media screen and (max-width: 400px) {
    width: 35px;
    height: 35px;
  }
`;

export const SocialMenuMobile = styled.div<ISocialBox>`
  cursor: pointer;
  background: ${(props) =>
    props.primaryColor === '#dedede' ? '#fff' : '#424242'};
  border: 1px solid #eaeaea;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 400px) {
    width: 35px;
    height: 35px;
  }
`;
