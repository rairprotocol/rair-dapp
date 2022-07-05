import styled from 'styled-components';

export const FooterMain = styled.footer`
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? '#fff' : 'rgba(56, 54, 55, 0.9);'};
  padding: 40px 120px 25px 120px;

  border-top: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#E5E5E5' : '#595959')};
`;

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding-bottom: 52px;
  border-bottom: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#E5E5E5' : '#595959')};
`;

export const FooterImage = styled.div`
  margin-bottom: 38px;

  img {
    height: 26px;
    width: auto;
  }
`;

export const FooterBoxJoin = styled.div``;

export const CommunityBlock = styled.div`
  .community-text {
    color: ${(props) => (props.primaryColor === 'rhyno' ? '#7A797A' : '#fff')};
  }
`;

export const CommunityBoxFooter = styled.div`
  display: flex;
  margin-top: 14px;
`;

export const NavFooter = styled.nav`
  display: flex;
`;

export const NavFooterBox = styled.ul`
  list-type: none;

  h4 {
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 14px;
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '#725BDB' : '#AA9DE9'};
  }

  li {
    font-size: 14px;
    color: ${(props) => (props.primaryColor === 'rhyno' ? '#7A797A' : '#fff')};
    margin-bottom: 8px;
  }
  li:last-child {
    margin-bottom: 0px;
  }
`;

export const ListFooter = styled.ul``;

export const FooterTextRairTech = styled.div`
  padding-top: 25px;

  ul {
    display: flex;
    justify-content: center;
    margin-bottom: 0;
    li {
      font-size: 14px;
      line-height: 28px;
      color: ${(props) =>
        props.primaryColor === 'rhyno' ? '#7A797A' : '#A7A6A6'};
    }
    li:nth-child(2) {
      margin: 0 32px;
    }
  }
`;

export const FooterEmailBlock = styled.div`
  h4 {
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => (props.primaryColor === 'rhyno' ? '#7A797A' : '#fff')};
  }

  .footer-send-email {
    margin-top: 14px;
    padding: 8px 4px 8px 16px;
    border: 1px solid
      ${(props) => (props.primaryColor === 'rhyno' ? '#DEDEDE' : '#666666')};
    border-radius: 13px;
    input {
      background: none;
      border: none;
      outline: none;
      color: ${(props) => (props.primaryColor === 'rhyno' ? '#000' : '#fff')};
    }

    input::placeholder {
      color: ${(props) =>
        props.primaryColor === 'rhyno' ? '#7A797A' : '#fff'};
    }

    button {
      padding: 8px 10px;
      border: none;
      border-radius: 10px;
      background: var(--stimorol);
      color: #fff;
    }
  }
`;
