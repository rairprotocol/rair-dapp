import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import useConnectUser from '../../../hooks/useConnectUser';
import { NavFooter, NavFooterBox } from '../../Footer/FooterItems/FooterItems';
import { BackBtnMobileNav } from '../NavigationItems/NavigationItems';
import chainData from '../../../utils/blockchainData';
import { RairFavicon, RairTokenLogo } from '../../../images';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';

interface IMobileNavigationList {
  messageAlert: string | null;
  setMessageAlert: (arg: string | null) => void;
  primaryColor: string;
  currentUserAddress: string | undefined;
  toggleMenu: (otherPage?: string) => void;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
  click: boolean;
}

const MobileNavigationList: React.FC<IMobileNavigationList> = ({
  messageAlert,
  setMessageAlert,
  primaryColor,
  toggleMenu,
  currentUserAddress,
  click
}) => {
  const hotDropsVar = import.meta.env.VITE_TESTNET;

  const {  currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const [copyEth, setCopyEth] = useState<boolean>(false);

  const { logoutUser } = useConnectUser();

  useEffect(() => {
    setCopyEth(false);

    return () => {
      setCopyEth(false);
    };
  }, [messageAlert, click]);

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
          {/* <li onClick={() => setMessageAlert('profileEdit')}>
            Personal Profile <i className="fal fa-edit" />
          </li> */}
          <li onClick={() => toggleMenu()}>
            <NavLink to={`/${currentUserAddress}`}>View Profile</NavLink>
          </li>
          {currentUserAddress && (
            <li
              onClick={() => {
                navigator.clipboard.writeText(currentUserAddress);
                setCopyEth(true);
              }}>
              {copyEth ? 'Copied!' : 'Copy your eth address'}
            </li>
          )}
        </NavFooterBox>
      ) : messageAlert === 'profileEdit' ? (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}
          messageAlert={messageAlert}>
          <div>
          <div style={{
              padding: "10px",
              width: "90vw",
              height: "150px",
              color: `${primaryColor === '#dedede' ? "#000" : "#fff"}`,
              display: "flex",
              justifyContent: "space-around",
              alignItems: 'center',
              borderRadius: "12px",
              border: "1px solid #000",
              marginBottom: '10px'
            }}> 
              <div style={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: 'space-evenly'
              }}>
              <div style={{
                display: "flex",
                marginBottom: "15px"
              }}>
                <div>
                  0.00
                {/* {isLoadingBalance ? <LoadingComponent size={18} /> : userBalance} */}
                </div>
                <div>
                {chainData[currentChain] && (
            <img style={{
              height: "25px",
              marginLeft: "15px"
            }} src={chainData[currentChain]?.image} alt="logo" />
          )}
                </div>
              </div>
              <div style={{
                display: "flex"
              }}>
                <div>
                  0.00
                {/* {isLoadingBalance ? <LoadingComponent size={18} /> : userBalance} */}
                </div>
                <div>
                <img style={{
              height: "25px",
              marginLeft: "15px"
            }} src={primaryColor === '#dedede' ?  RairFavicon : RairTokenLogo} alt="logo" />
                </div>
              </div>
              </div>
              <div style={{
                marginLeft: "25px",
                display: "flex",
                flexDirection: "column",

              }}>
                <div style={{
                  marginBottom: "10px"
                }} className="user-new-balance-title-text">
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>Exchange rate</div>
                <div style={{
                  fontSize: '14px'
                }}>50K RAIR/bETH</div>
                </div>
                <div>
                <TooltipBox position={'bottom'} title="Coming soon!">
                  <button style={{
                    background: "#7762D7",
                    color: "#fff",
                    border: "1px solid #000",
                    borderRadius: "12px",
                    width: "120px",
                    height: '50px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>Top up</button>
                  </TooltipBox>
                </div>
              </div>
            </div>
          </div>
          {currentUserAddress && (
            <li className="logout" onClick={logoutUser}>
              <i className="fas fa-sign-out-alt"></i>Logout
            </li>
          )}
        </NavFooterBox>
      ) : (
        <NavFooterBox
          className="nav-header-box-mobile"
          primaryColor={primaryColor}>
          {currentUserAddress && (
            <li className="logout" onClick={logoutUser}>
              <i className="fas fa-sign-out-alt"></i>Logout
            </li>
          )}
        </NavFooterBox>
      )}
    </NavFooter>
  );
};

export default MobileNavigationList;
