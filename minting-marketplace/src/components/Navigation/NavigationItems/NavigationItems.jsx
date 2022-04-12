import styled from 'styled-components';

export const Nav = styled.nav`
  background: ${(props) => props.primaryColor === "rhyno" ? "rgb(192, 192, 192)" : "rgb(43, 40, 41)"};
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  z-index: 12;
  width: 100%;
  position: ${(props) => props.editMode ? "fixed" : "reletive"}
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
      background: ${props => props.primaryColor === "rhyno" ? "rgb(211, 210, 211)" : "rgb(46, 44, 45)"};
  }

  .burger-menu-logout, .burder-menu-profile {
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

export const List = styled.ul`
      background: ${props => props.primaryColor === "rhyno" ? "rgb(201, 201, 201)" : "rgb(56, 54, 55)"};
      overflow: ${(props) => props.click && "hidden"};
      border-bottom-right-radius:  16px;
      border-bottom-left-radius: 16px;
      margin-top: 5px;
      display: flex;
      width: 100%;
      position: absolute;
      top: 80px;
      left: ${(props) => props.click ? "0" : "-100%"};
      opacity: ${(props) => props.click ? "1" : "0"};
      align-items: ${props => props.click && "center"};
      padding-left: ${props => props.click && "0px"};
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
  min-height: 20vh;
`;

export const ListEditProfileMode = styled.div`
  height: 92vh;
  background: ${props => props.primaryColor === "rhyno" ? "rgb(201, 201, 201)" : "rgb(56, 54, 55)"};
  position: fixed;
  width: 100%;
`;

export const ProfileButtonBack = styled.div`
  text-align: left;
  cursor: pointer;
`;
