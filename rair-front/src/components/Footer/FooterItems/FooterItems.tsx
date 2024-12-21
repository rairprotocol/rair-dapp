import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

type TFooterMainStyled = {
  primaryColor?: string;
  isDarkMode?: boolean;
  messageAlert?: string;
  hotdrops?: string;
  textColor?: any;
  secondaryColor?: string;
};

export const FooterMain = styled.footer.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  background: ${({ secondaryColor}) => secondaryColor}; 
  padding: 40px 120px 25px 120px;
  max-width: 1200px;
  margin: 0 auto;
  color: ${(props) => props.textColor};

  padding-top: 102px;

  a {
    color: ${({ textColor }) => textColor};
  }

  @media screen and (max-width: 1024px) {
    padding: 40px 40px 25px 40px;
  }

  @media screen and (max-width: 450px) {
    padding: 20px 20px 16px 20px;
  }
`;

export const FooterWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  display: flex;
  justify-content: start;
  gap: 4rem;
  align-items: flex-start;
  padding-bottom: 52px;
  border-bottom: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#E5E5E5' : '#595959')};

  .footer-box-join {
    display: flex;
    flex-direction: row;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

    .footer-box-join {
      flex-direction: column;
    }
  }
`;

export const FooterImage = styled.div`
  margin-bottom: 38px;

  img {
    height: 26px;
    width: auto;
  }

  img.logo-hotdrops-image {
    height: 80px;
    width: auto;
  }

  @media screen and (max-width: 450px) {
    margin-bottom: 0;

    img {
      display: none;
    }
  }
`;

export const FooterBoxJoin = styled.div``;

export const CommunityBlock = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  .community-text {
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '#7A797A' : '#fff'};
  }

  &.footer-community-hotdrops a {
    color: var(--hot-drops);
    text-decoration: underline;
  }

  &.footer-community-hotdrops h3 {
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '#7A797A' : '#fff'};
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 768px) {
    text-align: center;
  }
`;

export const CommunityBoxFooter = styled.div`
  &.header-mobile-community {
    justify-content: center;
  }

  display: flex;
  margin-top: 14px;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

export const NavFooter = styled.nav`
  display: flex;

  @media screen and (max-width: 768px) {
    margin-bottom: 28px;
    width: 100%;
    justify-content: space-evenly;
  }

  @media screen and (max-width: 450px) {
    justify-content: space-around;
  }
`;

export const NavFooterBox = styled.ul.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  list-type: none;
  padding-left: 5rem;

  &.footer-nav-item-hotdrop {
    padding-left: 0;
    text-align: center;

    li {
      justify-content: center;
      display: flex;
      margin-bottom: 10px;
      text-decoration: underline;
    }

    li:last-child {
      margin-bottom: 0px;
    }
  }

  @media screen and (max-width: 768px) {
    margin-top: 1rem;
    padding-left: 0rem;
  }

  // no longer using this code chunk in footer, but was previously used in FooterItems
  &.nav-header-box-mobile {
    li {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 16px;
      margin-bottom: 5px;
      color: ${(props) =>
        props.messageAlert && props.messageAlert === 'profileEdit'
          ? '#19a7f6'
          : ''};
      i {
        margin-right: 10px;
      }

      i.fal.fa-edit {
        margin-left: 10px;
        font-size: 22px;
        color: ${(props) =>
          props.messageAlert && props.messageAlert === 'profileEdit'
            ? '#19a7f6'
            : ''};
      }
    }

    li:hover {
      color: #19a7f6;
    }
  }

  &.footer-nav-item-hotdrop h3 {
    color: ${(isDarkMode) => (!isDarkMode ? '#7A797A' : '#fff')};
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  h4 {
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 14px;
    color: ${(isDarkMode) => (!isDarkMode ? '#725BDB' : '#AA9DE9')};
  }

  li {
    font-size: 14px;
    color: ${(isDarkMode) => (!isDarkMode ? '#7A797A' : '#fff')};
    justify-content: center;
    display: flex;
  }

  li.logout {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  // li:last-child {
  //   margin-bottom: 0px;
  // }
`;

export const ListFooter = styled.ul``;

export const FooterTextRairTech = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  padding-top: 25px;

  ul {
    display: flex;
    justify-content: center;
    margin-bottom: 0;
    li {
      font-size: 14px;
      line-height: 28px;
      color: ${(props) => props.textColor};
    }
    li:nth-child(2) {
      margin: 0 32px;
    }
  }

  @media screen and (max-width: 450px) {
    padding-top: 20px;
    ul {
      padding-left: 0;
      flex-direction: column;
      align-items: center;
      li {
        font-size: 10px;
      }
    }
  }
`;

export const FooterEmailBlock = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFooterMainStyled>`
  h4 {
    font-size: 16px;
    line-height: 20px;
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '#7A797A' : '#fff'};
  }

  .footer-send-email {
    margin-top: 14px;
    padding: 8px 4px 8px 16px;
    border: 1px solid
      ${(props) => (props.primaryColor === '#dedede' ? '#DEDEDE' : '#666666')};
    border-radius: 13px;
    input {
      background: none;
      border: none;
      outline: none;
      color: ${(props) => (props.primaryColor === '#dedede' ? '#000' : '#fff')};
    }

    input::placeholder {
      color: ${(props) =>
        props.primaryColor === '#dedede' ? '#7A797A' : '#fff'};
    }

    button {
      padding: 8px 10px;
      border: none;
      border-radius: 10px;
      background: var(--stimorol);
      color: #fff;
    }
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 28px;
    width: 80%;

    .footer-send-email {
      display: flex;
      justify-content: space-between;
    }

    h4 {
      text-align: center;
    }
  }

  @media screen and (max-width: 450px) {
    width: 100%;

    .footer-send-email {
      justify-content: space-between;

      input,
      button {
        font-size: 12px;
      }
      button {
        padding: 8px 20px;
      }
    }
  }
`;
