//@ts-nocheck
import styled from 'styled-components';

export const Nav = styled.nav`
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? 'rgb(192, 192, 192)' : 'rgb(43, 40, 41)'};
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  z-index: 12;
  width: 100%;
  position: ${(props) => (props.editMode ? 'fixed' : 'reletive')};
`;

export const ListItem = styled.li`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vw;
  padding: 30px 0px;
  width: 100%;
  &:hover {
    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? 'rgb(211, 210, 211)'
        : 'rgb(46, 44, 45)'};
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
    props.primaryColor === 'rhyno' ? 'rgb(201, 201, 201)' : 'rgb(56, 54, 55)'};
  overflow: ${(props) => props.click && 'hidden'};
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  margin-top: 5px;
  display: flex;
  width: 100%;
  position: absolute;
  top: 80px;
  left: ${(props) => (props.click ? '0' : '-100%')};
  opacity: ${(props) => (props.click ? '1' : '0')};
  align-items: ${(props) => props.click && 'center'};
  padding-left: ${(props) => props.click && '0px'};
  transition: all 0.5s ease;
  flex-direction: column;
  list-style-type: none;
  grid-gap: 0px;
  z-index: 12;
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
