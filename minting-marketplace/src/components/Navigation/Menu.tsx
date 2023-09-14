import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { ethers, utils } from 'ethers';

import { TUserResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { TUsersInitialState, UserType } from '../../ducks/users/users.types';
import useConnectUser from '../../hooks/useConnectUser';
import { BellIcon, CloseIconMobile, MenuIcon } from '../../images';
import {
  SocialBox,
  SocialBoxSearch,
  SocialMenuMobile,
  UserIconMobile
} from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { OnboardingButton } from '../common/OnboardingButton/OnboardingButton';
import AikonWidget from '../UserProfileSettings/AikonWidget/AikonWidget';
import { SvgUserIcon } from '../UserProfileSettings/SettingsIcons/SettingsIcons';

import MobileChoiseNav from './MenuComponents/MobileChoiseNav';
import MobileListMenu from './MenuComponents/MobileListMenu';
import MobileProfileInfo from './MenuComponents/MobileProfileInfo';
import {
  MenuMobileWrapper,
  Nav,
  RightSideMenu
} from './NavigationItems/NavigationItems';

import './Menu.css';

interface IMenuNavigation {
  connectUserData: () => void;
  renderBtnConnect: boolean;
  currentUserAddress: string | undefined;
  programmaticProvider:
    | ethers.Wallet
    | ethers.providers.JsonRpcSigner
    | undefined;
  showAlert: boolean | null | undefined;
  selectedChain: any | undefined;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
  isAboutPage: boolean;
  realChainId: string | undefined;
}

const MenuNavigation: React.FC<IMenuNavigation> = ({
  renderBtnConnect,
  currentUserAddress,
  programmaticProvider,
  showAlert,
  selectedChain,
  setTabIndexItems,
  isSplashPage,
  isAboutPage,
  realChainId
}) => {
  const [click, setClick] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const { connectUserData } = useConnectUser();
  // const [loading, setLoading] = useState<boolean>(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [messageAlert, setMessageAlert] = useState<string | null>(null);
  const { loggedIn, loginProcess } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const handleMessageAlert = (pageNav: string) => {
    setMessageAlert(pageNav);
  };

  const handleActiveSearch = () => {
    setActiveSearch((prev) => !prev);
  };

  const toggleMenu = (otherPage?: string | undefined) => {
    if (otherPage === 'nav') {
      setClick(true);
      if (!click) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    } else {
      setClick((prev) => !prev);
      if (!click) {
        document.body.classList.add('no-scroll');
        setMessageAlert(null);
        setActiveSearch(false);
      } else {
        setMessageAlert(null);
        document.body.classList.remove('no-scroll');
        setActiveSearch(false);
      }
    }
  };

  const toggleOpenProfile = useCallback(() => {
    setOpenProfile((prev) => !prev);
  }, [setOpenProfile]);

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (currentUserAddress && utils.isAddress(currentUserAddress)) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${currentUserAddress}`)
        .then((res) => {
          setUserData(null);
          // setLoading(true);
          return res.data;
        });
      if (result.success) {
        // setLoading(false);
        setUserData(result.user);
      }
    }
  }, [currentUserAddress, setUserData]);

  const onScrollClick = useCallback(() => {
    if (!click) {
      document.body.style.overflow = 'unset';
    }
  }, [click]);

  useEffect(() => {
    onScrollClick();
  }, [onScrollClick]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  return (
    <MenuMobileWrapper
      className="col-1 rounded burder-menu"
      showAlert={showAlert}
      selectedChain={selectedChain}
      isSplashPage={isSplashPage}
      realChainId={realChainId}>
      <Nav hotdrops={hotdropsVar} primaryColor={primaryColor}>
        <MobileChoiseNav
          click={click}
          messageAlert={messageAlert}
          currentUserAddress={currentUserAddress}
          handleMessageAlert={handleMessageAlert}
          activeSearch={activeSearch}
          handleActiveSearch={handleActiveSearch}
        />
        {openProfile ? (
          <Suspense fallback={<h1>Loading profile...</h1>}>
            <MobileProfileInfo
              primaryColor={primaryColor}
              click={click}
              toggleOpenProfile={toggleOpenProfile}
              userData={userData}
            />
          </Suspense>
        ) : (
          <MobileListMenu
            primaryColor={primaryColor}
            click={click}
            toggleMenu={toggleMenu}
            activeSearch={activeSearch}
            messageAlert={messageAlert}
            setMessageAlert={setMessageAlert}
            setTabIndexItems={setTabIndexItems}
            isSplashPage={isSplashPage}
          />
        )}
        <RightSideMenu>
          <div>
            {!loggedIn ? (
              <div>
                <div>
                  {isAboutPage ? null : (
                    <button
                      className={`btn btn-${primaryColor} btn-connect-wallet-mobile ${
                        hotdropsVar === 'true' ? 'hotdrops-bg' : ''
                      }`}
                      onClick={() => connectUserData()}>
                      {loginProcess ? 'Please wait...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="social-media">
                {!messageAlert && (
                  <>
                    <SocialBoxSearch
                      primaryColor={primaryColor}
                      hotdrops={hotdropsVar}
                      onClick={() => {
                        handleActiveSearch();
                        toggleMenu('nav');
                      }}
                      activeSearch={activeSearch}
                      marginRight={'17px'}>
                      <i className="fas fa-search" aria-hidden="true"></i>
                    </SocialBoxSearch>
                    {/* this is where the aikon widget should go: */}
                    <div
                      className="mobileAikonWidget"
                      style={{
                        backgroundColor:
                          primaryColor === 'rhyno'
                            ? 'var(--rhyno-20)'
                            : 'var(----charcoal-80)'
                      }}>
                      <AikonWidget />
                    </div>
                    <NavLink to={`/${currentUserAddress}`}>
                      <UserIconMobile
                        onClick={() => setClick(false)}
                        avatar={userData && userData.avatar}
                        marginRight={'16px'}
                        messageAlert={messageAlert}
                        primaryColor={primaryColor}>
                        {userData && !userData.avatar && (
                          <SvgUserIcon width={'22.5px'} height={'22.5px'} />
                        )}
                      </UserIconMobile>
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>
          {!loggedIn && (
            <SocialBoxSearch
              primaryColor={primaryColor}
              hotdrops={hotdropsVar}
              onClick={() => {
                handleActiveSearch();
                toggleMenu('nav');
              }}
              activeSearch={activeSearch}
              marginRight={'17px'}>
              <i className="fas fa-search" aria-hidden="true"></i>
            </SocialBoxSearch>
          )}
          {click ? (
            <SocialMenuMobile primaryColor={primaryColor} onClick={toggleMenu}>
              <CloseIconMobile primaryColor={primaryColor} />
            </SocialMenuMobile>
          ) : (
            <SocialMenuMobile
              primaryColor={primaryColor}
              onClick={() => {
                toggleMenu();
                setOpenProfile(false);
              }}>
              <MenuIcon primaryColor={primaryColor} />
            </SocialMenuMobile>
          )}
        </RightSideMenu>
      </Nav>
    </MenuMobileWrapper>
  );
};

export default MenuNavigation;
