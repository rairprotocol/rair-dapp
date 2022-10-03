import React from 'react';
import { NavLink } from 'react-router-dom';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { NavFooter, NavFooterBox } from '../../Footer/FooterItems/FooterItems';
import TalkSalesComponent from '../../Header/HeaderItems/TalkToSalesComponent/TalkSalesComponent';
import { BackBtnMobileNav } from '../NavigationItems/NavigationItems';
import MobileEditProfile from './MobileEditProfile';

interface IMobileNavigationList {
  messageAlert: string | null;
  setMessageAlert: (arg: string | null) => void;
  primaryColor: ColorChoice;
  currentUserAddress: string | undefined;
  toggleMenu: (otherPage?: string) => void;
  logout: () => void;
  setTabIndexItems: (arg: number) => void;
}

const MobileNavigationList: React.FC<IMobileNavigationList> = ({
  messageAlert,
  setMessageAlert,
  primaryColor,
  toggleMenu,
  currentUserAddress,
  logout,
  setTabIndexItems
}) => {
  const goToMyItems = (tab: number) => {
    setTabIndexItems(tab);
    toggleMenu();
  };

  return (
    <NavFooter>
      {messageAlert && messageAlert === 'notification' ? (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}>
          <BackBtnMobileNav onClick={() => setMessageAlert(null)}>
            <i className="fas fa-chevron-left"></i>
          </BackBtnMobileNav>
          <li>You don’t have notifications yet</li>
        </NavFooterBox>
      ) : messageAlert === 'profile' ? (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}>
          <BackBtnMobileNav onClick={() => setMessageAlert(null)}>
            <i className="fas fa-chevron-left"></i>
          </BackBtnMobileNav>
          <li onClick={() => setMessageAlert('profileEdit')}>
            Personal Profile <i className="fal fa-edit" />
          </li>
          <li onClick={() => goToMyItems(2)}>
            <NavLink to="/my-items">My favorites</NavLink>
          </li>
          <li onClick={() => goToMyItems(0)}>
            <NavLink to="/my-items">My items</NavLink>
          </li>
        </NavFooterBox>
      ) : messageAlert === 'profileEdit' ? (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}
          messageAlert={messageAlert}>
          <BackBtnMobileNav onClick={() => setMessageAlert('profile')}>
            <i className="fas fa-chevron-left"></i>
          </BackBtnMobileNav>
          <li>
            Personal Profile <i className="fal fa-edit" />
          </li>
          <MobileEditProfile />
        </NavFooterBox>
      ) : (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}>
          <li onClick={() => toggleMenu()}>
            <NavLink to="/about-page">About</NavLink>
          </li>
          <li>
            <a
              href="https://etherscan.io/token/0xc76c3ebea0ac6ac78d9c0b324f72ca59da36b9df"
              target={'_blank'}
              rel="noreferrer">
              Contract
            </a>
          </li>
          <li>
            <TalkSalesComponent
              text={'Talk to sales'}
              classes={'inquiries-sales'}
            />
          </li>
          {currentUserAddress && (
            <li className="logout" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>Logout
            </li>
          )}
        </NavFooterBox>
      )}
    </NavFooter>
  );
};

export default MobileNavigationList;
