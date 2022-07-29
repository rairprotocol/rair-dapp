//@ts-nocheck
import styled from 'styled-components';

export const MenuMobileWrapper = styled.div`
  z-index: 50;
  position: fixed;
  padding: 0;
`;

export const Nav = styled.nav`
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? '#fff' : '#383637'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  z-index: 12;
  width: 100%;
  position: ${(props) => (props.editMode ? 'fixed' : 'reletive')};
`;

export const ListItem = styled.li`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4vw;
  padding: 30px 0px;
  width: 100%;
  &:hover {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? 'rgb(211, 210, 211)' : '#383637'};
  }

  .burger-menu-logout,
  .burder-menu-profile {
    width: 100%;
    cursor: pointer;
    i {
      margin-right: 10px;
    }
  }

  a {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

export const TitleEditProfile = styled.h4`
  @media screen and (max-width: 380px) {
    margin-top: -30px;
  }
`;

export const List = styled.ul`
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? '#fff' : 'rgb(56, 54, 55)'};
  overflow: ${(props) => props.click && 'hidden'};
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 50px;
  width: 100%;
  height: 93vh;
  position: absolute;
  top: 73px;
  left: ${(props) => (props.click ? '0' : '-100%')};
  opacity: ${(props) => (props.click ? '1' : '0')};
  align-items: ${(props) => props.click && 'center'};
  padding-left: ${(props) => props.click && '20px'};
  transition: all 0.5s ease-in-out;
  flex-direction: column;
  list-style-type: none;
  grid-gap: 0px;
  z-index: 50;
`;

export const ListProfileItem = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 30vh;
`;

export const ListProfileLoading = styled.div`
  min-height: 30vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;

  .mobile-profile-preloader {
    width: 100%;
    margin-top: 100px;
  }
`;

export const ListEditProfileMode = styled.div`
  padding: 20px;
  height: 100%;
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? 'rgb(201, 201, 201)' : 'rgb(56, 54, 55)'};
  position: fixed;
  width: 100%;
  transition: 0.5s all ease;
  overflow: auto;

  h4 {
    font-weight: bold;
  }

  @media screen and (max-width: 340px) {
    height: 83vh;
  }
`;

export const BlockAvatar = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;

  @media screen and (max-width: 380px) {
    margin: 10px 0 0 0;
  }
`;

export const ProfileButtonBack = styled.div`
  text-align: left;
  cursor: pointer;
  font-size: 25px;
`;

export const InputChange = styled.input`
  width: 90vw;
  background: #383637;
  border: 2px solid #e882d5;
  border-radius: 16px;
  font-size: 20px;
  margin-bottom: 15px;
  color: grey;
  padding: 10px 16px;

  &:focus {
    border: 2px solid #fff;
    outline: none;
    color: white;
  }

  @media screen and (max-width: 380px) {
    margin-bottom: 10px;
    font-size: 16px;
    width: 80vw;
  }
`;

export const LabelForm = styled.div`
  color: white;
  font-size: 20px;
  padding: 0 0 10px 10px;

  @media screen and (max-width: 380px) {
    font-size: 16px;
  }
`;

export const ErrorInput = styled.div`
  color: rgb(228, 71, 109);
  font-size: 16px;
  font-weight: 700;
`;

export const ButtonEdit = styled.button`
  border-radius: 12px;
  border: none;
  background: #e882d5;
  font-size: 25px;
  padding: 10px 20px;
  color: white;
  margin-top: 10px;

  @media screen and (max-width: 380px) {
    font-size: 16px;
  }
`;

export const RightSideMenu = styled.div`
  display: flex;

  button.btn-connect-wallet-mobile {
    width: 90px;
    height: 40px;
    box-shadow: inset 0px 3.11351px 3.11351px rgba(74, 74, 74, 0.25);
    background: #bb73d7;
    border: 1px solid #f1b4e6;
    border-radius: 10px;
    margin-right: 16px;
    font-size: 12px;
    font-weight: 700;
    color: #fff !important;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #bd6bae;
    }
    &:active {
      background: #925486;
    }
  }
`;

export const SearchInputMobile = styled.div`
  position: relative;
  width: 90vw;
  border-radius: 12px;
  background: none;
  padding: 8px 16px;
  border: 1px solid #666666;
  color: white;
  transition: all 0.1s ease;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  i {
    color: #bd6bae;
    font-size: 18px;
    font-weight: 400;
  }

  input {
    margin-left: 10px;
    background: none;
    border: none;
    width: 100%;
    outline: none;
    color: ${(props) => (props.primaryColor === 'rhyno' ? '#000' : '#fff')};
  }
`;

export const BackBtnMobileNav = styled.div`
  width: 80vw;
  text-align: left;
  cursor: pointer;

  i {
    color: #bd6bae;
  }
`;
