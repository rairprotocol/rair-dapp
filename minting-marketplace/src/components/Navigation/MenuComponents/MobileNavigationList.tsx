import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavFooter, NavFooterBox } from '../../Footer/FooterItems/FooterItems';
import { BackBtnMobileNav } from '../NavigationItems/NavigationItems';

const MobileNavigationList = ({
  messageAlert,
  setMessageAlert,
  primaryColor,
  toggleMenu,
  currentUserAddress,
  logout
}) => {
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
          <li>My profile</li>
          <li>My favorites</li>
          <li onClick={toggleMenu}>
            <NavLink to="/my-items">My items</NavLink>
          </li>
        </NavFooterBox>
      ) : (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}>
          <li onClick={toggleMenu}>
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
          <li>Inquiries</li>
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
