import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { formatEther, isAddress, ZeroAddress } from 'ethers';

import { TUserResponse } from '../../axios.responseTypes';
import useConnectUser from '../../hooks/useConnectUser';
import useContracts from '../../hooks/useContracts';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import {
  BellIcon,
  CloseIconMobile,
  MenuIcon,
  RairFavicon,
  RairTokenLogo,
  VerifiedIcon
} from '../../images';
import { dataStatuses } from '../../redux/commonTypes';
import {
  SocialBox,
  SocialBoxSearch,
  SocialMenuMobile,
  UserIconMobile
} from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { User } from '../../types/databaseTypes';
import { rFetch } from '../../utils/rFetch';
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
import { fetchNotifications } from '../../redux/notificationsSlice';

interface IMenuNavigation {
  renderBtnConnect: boolean;
  currentUserAddress: string | undefined;
  showAlert: boolean | null | undefined;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
  isAboutPage: boolean;
  realChainId: string | undefined;
}

const MenuNavigation: React.FC<IMenuNavigation> = ({
  showAlert,
  setTabIndexItems,
  isSplashPage,
  isAboutPage,
  realChainId
}) => {
  const [click, setClick] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const { getBlockchainData } = useServerSettings();
  const { connectUserData } = useConnectUser();
  // const [loading, setLoading] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [messageAlert, setMessageAlert] = useState<string | null>(null);
  const { isLoggedIn, loginStatus, ageVerified } = useAppSelector(
    (store) => store.user
  );
  const { mainTokenInstance } = useContracts();
  const { currentUserAddress, connectedChain } = useAppSelector(
    (state) => state.web3
  );
  const { totalUnreadCount } = useAppSelector((store) => store.notifications);

  const {
    primaryButtonColor,
    textColor,
    iconColor,
    secondaryColor,
    primaryColor,
    isDarkMode
  } = useAppSelector((store) => store.colors);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

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
    if (
      currentUserAddress &&
      isAddress(currentUserAddress) &&
      currentUserAddress !== ZeroAddress
    ) {
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

  const getBalance = useCallback(async () => {
    if (currentUserAddress && mainTokenInstance?.runner?.provider) {
      setIsLoadingBalance(true);
      const balance =
        await mainTokenInstance.runner?.provider?.getBalance(
          currentUserAddress
        );

      if (balance !== undefined) {
        const result = formatEther(balance.toString());
        const final = Number(result.toString())?.toFixed(2)?.toString();

        setUserBalance(final);
        setIsLoadingBalance(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserAddress, mainTokenInstance, userData]);

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

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    if (currentUserAddress && isLoggedIn) {
      dispatch(fetchNotifications());
    }
  }, [currentUserAddress, isLoggedIn]);

  return (
    <MenuMobileWrapper
      className="col-1 rounded burder-menu"
      showAlert={showAlert}
      secondaryColor={secondaryColor}
      isSplashPage={isSplashPage}
      realChainId={realChainId}>
      <Nav
        hotdrops={hotdropsVar}
        secondaryColor={secondaryColor}
        primaryColor={primaryColor}>
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
              click={click}
              toggleOpenProfile={toggleOpenProfile}
            />
          </Suspense>
        ) : (
          <MobileListMenu
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
            {!isLoggedIn ? (
              <div>
                <div>
                  {isAboutPage ? null : (
                    <button
                      className={`btn rair-button btn-connect-wallet-mobile`}
                      style={{
                        background: `${
                          primaryColor === '#dedede'
                            ? import.meta.env.VITE_TESTNET === 'true'
                              ? 'var(--hot-drops)'
                              : 'linear-gradient(to right, #e882d5, #725bdb)'
                            : import.meta.env.VITE_TESTNET === 'true'
                              ? primaryButtonColor ===
                                'linear-gradient(to right, #e882d5, #725bdb)'
                                ? 'var(--hot-drops)'
                                : primaryButtonColor
                              : primaryButtonColor
                        }`,
                        color: textColor
                      }}
                      onClick={() => connectUserData()}>
                      {loginStatus === dataStatuses.Loading
                        ? 'Please wait...'
                        : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="social-media">
                {!messageAlert && (
                  <>
                    <>
                      {click && (
                        <>
                          <SocialBoxSearch
                            primaryColor={primaryColor}
                            hotdrops={hotdropsVar}
                            onClick={() => {
                              handleActiveSearch();
                              toggleMenu('nav');
                            }}
                            activeSearch={activeSearch}
                            marginRight={'10px'}>
                            <FontAwesomeIcon
                              icon={faSearch}
                              style={{
                                color:
                                  import.meta.env.VITE_TESTNET === 'true'
                                    ? `${
                                        iconColor === '#1486c5'
                                          ? '#F95631'
                                          : iconColor
                                      }`
                                    : `${
                                        iconColor === '#1486c5'
                                          ? '#E882D5'
                                          : iconColor
                                      }`
                              }}
                              aria-hidden="true"
                            />
                          </SocialBoxSearch>
                          {/* this is where the aikon widget should go: */}
                          {/* {currentUserAddress && userBalance.length < 7 && (
                            <>
                              <SocialBox
                                onClick={() => {
                                  handleMessageAlert('notification');
                                  toggleMenu('nav');
                                  handleActiveSearch();
                                }}
                                className="social-bell-icon"
                                width="40px"
                                height="40px"
                                marginRight={'10px'}>
                                <BellIcon primaryColor={primaryColor} />
                              </SocialBox>
                            </>
                          )} */}
                        </>
                      )}
                    </>
                    <div
                      style={{
                        marginRight: '10px'
                      }}
                      onClick={() => {
                        handleMessageAlert('notification');
                        toggleMenu('nav');
                      }}
                      className="social-media-profile">
                      {currentUserAddress && (
                        <SocialBox
                          className="social-bell-icon notifications"
                          width="40px"
                          height="40px"
                          marginLeft={'17px'}>
                          <BellIcon primaryColor={primaryColor} />
                          {totalUnreadCount > 0 ? (
                            <div
                              className="red-circle-notifications"
                              style={{
                                fontSize: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                color: '#fff'
                              }}>
                              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                            </div>
                          ) : (
                            ''
                          )}
                        </SocialBox>
                      )}
                    </div>
                    <div
                      onClick={() => {
                        handleMessageAlert('profileEdit');
                        toggleMenu('nav');
                      }}
                      className="mobileAikonWidget"
                      style={{
                        backgroundColor: !isDarkMode
                          ? 'var(--rhyno-20)'
                          : 'var(--charcoal-80)'
                      }}>
                      <div
                        className={`profile-user-balance ${
                          primaryColor === 'rhyno' ? 'rhyno' : ''
                        }`}>
                        <img
                          style={{
                            marginRight: '5px'
                          }}
                          src={
                            primaryColor === '#dedede'
                              ? RairFavicon
                              : RairTokenLogo
                          }
                          alt="logo"
                        />
                        {connectedChain &&
                          getBlockchainData(connectedChain) && (
                            <img
                              src={getBlockchainData(connectedChain)?.image}
                              alt="logo"
                            />
                          )}
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'relative'
                      }}>
                      <NavLink to={`/${currentUserAddress}`}>
                        {isLoggedIn && ageVerified && (
                          <img
                            style={{
                              position: 'absolute',
                              width: 20,
                              height: 20,
                              top: '-5px',
                              left: '45%'
                            }}
                            src={VerifiedIcon}
                            alt="verified icon"
                          />
                        )}
                        <UserIconMobile
                          onClick={() => setClick(false)}
                          avatar={userData && userData.avatar}
                          marginRight={'10px'}
                          messageAlert={messageAlert}
                          primaryColor={primaryColor}>
                          {userData && !userData.avatar && (
                            <SvgUserIcon width={'22.5px'} height={'22.5px'} />
                          )}
                        </UserIconMobile>
                      </NavLink>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {!isLoggedIn && (
            <SocialBoxSearch
              primaryColor={primaryColor}
              hotdrops={hotdropsVar}
              onClick={() => {
                handleActiveSearch();
                toggleMenu('nav');
              }}
              activeSearch={activeSearch}
              marginRight={'17px'}>
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  color:
                    import.meta.env.VITE_TESTNET === 'true'
                      ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                      : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
                }}
              />
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
