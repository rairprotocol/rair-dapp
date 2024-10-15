import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { faChevronLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther } from 'ethers';

import useConnectUser from '../../../hooks/useConnectUser';
import useContracts from '../../../hooks/useContracts';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import { RairFavicon, RairTokenLogo } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import LoadingComponent from '../../common/LoadingComponent';
import { TooltipBox } from '../../common/Tooltip/TooltipBox';
import { NavFooter, NavFooterBox } from '../../Footer/FooterItems/FooterItems';
import PaginationBox from '../../MockUpPage/PaginationBox/PaginationBox';
import NotificationBox from '../../UserProfileSettings/PopUpNotification/NotificationBox/NotificationBox';
import { BackBtnMobileNav } from '../NavigationItems/NavigationItems';
import { fetchNotifications } from '../../../redux/notificationsSlice';

interface IMobileNavigationList {
  messageAlert: string | null;
  setMessageAlert: (arg: string | null) => void;
  toggleMenu: (otherPage?: string) => void;
  setTabIndexItems: (arg: number) => void;
  isSplashPage: boolean;
  click: boolean;
}

const MobileNavigationList: React.FC<IMobileNavigationList> = ({
  messageAlert,
  setMessageAlert,
  toggleMenu,
  click
}) => {
  const dispatch = useAppDispatch();
  const [userBalance, setUserBalance] = useState<string>('');
  const [userRairBalance, setUserRairBalance] = useState<bigint>(BigInt(0));
  const { primaryColor, primaryButtonColor, textColor, isDarkMode } =
    useAppSelector((store) => store.colors);

  const { web3TxHandler } = useWeb3Tx();

  const { currentUserAddress, connectedChain } = useAppSelector(
    (store) => store.web3
  );
  const { isLoggedIn } = useAppSelector((store) => store.user);
  const { mainTokenInstance } = useContracts();

  const { getBlockchainData } = useServerSettings();

  const getBalance = useCallback(async () => {
    if (currentUserAddress && mainTokenInstance?.runner?.provider) {
      const balance =
        await mainTokenInstance.runner.provider.getBalance(currentUserAddress);

      if (balance !== undefined) {
        const result = formatEther(balance.toString());
        const final = Number(result.toString())?.toFixed(2)?.toString();

        setUserBalance(final);
      }
    }
  }, [currentUserAddress, mainTokenInstance]);

  const getUserRairBalance = useCallback(async () => {
    if (
      !isLoggedIn ||
      !currentUserAddress ||
      !mainTokenInstance ||
      userRairBalance > BigInt(0)
    ) {
      return;
    }
    const result = await web3TxHandler(mainTokenInstance, 'balanceOf', [
      currentUserAddress
    ]);
    if (result) {
      setUserRairBalance(result);
    }
  }, [
    isLoggedIn,
    currentUserAddress,
    mainTokenInstance,
    userRairBalance,
    web3TxHandler
  ]);

  const [copyEth, setCopyEth] = useState<boolean>(false);
  const [flagLoading, setFlagLoading] = useState(false);
  const { notifications, totalCount } = useAppSelector(
    (store) => store.notifications
  );
  const [currentPageNotification, setCurrentPageNotification] =
    useState<number>(1);
  const reactSwal = useSwal();

  const { logoutUser } = useConnectUser();

  const changePageForVideo = (currentPage: number) => {
    setCurrentPageNotification(currentPage);
    const currentPageNumber = currentPage === 0 ? currentPage : currentPage - 1;
    dispatch(fetchNotifications(Number(currentPageNumber)));
  };

  const deleteAllNotificaiton = useCallback(async () => {
    if (currentUserAddress) {
      setFlagLoading(true);
      const result = await rFetch(`/api/notifications`, {
        method: 'DELETE',
        body: JSON.stringify([])
      });

      if (result.success) {
        dispatch(fetchNotifications());
        reactSwal.fire({
          title: 'Success',
          icon: 'success'
        });
        setFlagLoading(false);
      }
      setFlagLoading(false);
    }
  }, [currentUserAddress, dispatch, reactSwal]);

  useEffect(() => {
    if (currentUserAddress && isLoggedIn) {
      dispatch(fetchNotifications(0));
    }
  }, [currentUserAddress, isLoggedIn]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  useEffect(() => {
    getUserRairBalance();
  }, [getUserRairBalance]);

  useEffect(() => {
    setCopyEth(false);

    return () => {
      setCopyEth(false);
    };
  }, [messageAlert, click]);

  return (
    <NavFooter>
      {messageAlert && messageAlert === 'notification' ? (
        <NavFooterBox className="nav-header-box-mobile" isDarkMode={isDarkMode}>
          <BackBtnMobileNav onClick={() => setMessageAlert(null)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </BackBtnMobileNav>
          <div
            style={{
              width: '90vw',
              height: '65vh',
              overflowY: 'auto',
              marginTop: '20px',
              padding: '20px 0'
            }}>
            <div className="btn-clear-nofitications">
              <button
                className="btn-clear-nofitications"
                onClick={() => deleteAllNotificaiton()}
                disabled={totalCount === 0}
                style={{
                  color: textColor,
                  background: `${
                    totalCount === 0
                      ? '#ababab'
                      : primaryColor === '#dedede'
                        ? import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : 'linear-gradient(to right, #e882d5, #725bdb)'
                        : import.meta.env.VITE_TESTNET === 'true'
                          ? primaryButtonColor ===
                            'linear-gradient(to right, #e882d5, #725bdb)'
                            ? 'var(--hot-drops)'
                            : primaryButtonColor
                          : primaryButtonColor
                  }`
                }}>
                Clear all
              </button>
            </div>
            {flagLoading ? (
              <LoadingComponent />
            ) : notifications && notifications.length > 0 ? (
              notifications.map((el) => {
                return (
                  <NotificationBox el={el} key={el._id} title={el.message} />
                );
              })
            ) : (
              <div
                style={{
                  padding: '25px 16px'
                }}>
                {"You don't have any notifications now"}
              </div>
            )}
          </div>
          {totalCount > 0 && (
            <PaginationBox
              totalPageForPagination={totalCount}
              changePage={changePageForVideo}
              currentPage={currentPageNotification}
              itemsPerPageNotifications={10}
              whatPage={'notifications'}
            />
          )}
        </NavFooterBox>
      ) : messageAlert === 'profile' ? (
        <NavFooterBox className="nav-header-box-mobile" isDarkMode={isDarkMode}>
          <BackBtnMobileNav onClick={() => setMessageAlert(null)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </BackBtnMobileNav>
          {/* <li onClick={() => setMessageAlert('profileEdit')}>
            Personal Profile <FontAwesomeIcon icon={faLeft} />
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
          isDarkMode={isDarkMode}
          messageAlert={messageAlert}>
          <div>
            <div
              style={{
                padding: '10px',
                width: '90vw',
                height: '150px',
                color: `${primaryColor === '#dedede' ? '#000' : '#fff'}`,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: '12px',
                border: '1px solid #000',
                marginBottom: '10px'
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly'
                }}>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '15px'
                  }}>
                  <div>
                    {userBalance ? userBalance : 0.0}
                    {/* {isLoadingBalance ? <LoadingComponent size={18} /> : userBalance} */}
                  </div>
                  <div>
                    {connectedChain && getBlockchainData(connectedChain) && (
                      <img
                        style={{
                          height: '25px',
                          marginLeft: '15px'
                        }}
                        src={getBlockchainData(connectedChain)?.image}
                        alt="logo"
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex'
                  }}>
                  <div>
                    {userRairBalance ? formatEther(userRairBalance) : 0.0}
                    {/* {isLoadingBalance ? <LoadingComponent size={18} /> : userBalance} */}
                  </div>
                  <div>
                    <img
                      style={{
                        height: '25px',
                        marginLeft: '15px'
                      }}
                      src={
                        primaryColor === '#dedede' ? RairFavicon : RairTokenLogo
                      }
                      alt="logo"
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginLeft: '25px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                <div
                  style={{
                    marginBottom: '10px'
                  }}
                  className="user-new-balance-title-text">
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                    Exchange rate
                  </div>
                  <div
                    style={{
                      fontSize: '14px'
                    }}>
                    50K RAIR/bETH
                  </div>
                </div>
                <div>
                  <TooltipBox position={'bottom'} title="Coming soon!">
                    <button
                      style={{
                        background: '#7762D7',
                        color: '#fff',
                        border: '1px solid #000',
                        borderRadius: '12px',
                        width: '120px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      Top up
                    </button>
                  </TooltipBox>
                </div>
              </div>
            </div>
          </div>
          {currentUserAddress && isLoggedIn && (
            <li className="logout" onClick={logoutUser}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </li>
          )}
        </NavFooterBox>
      ) : (
        <NavFooterBox className="nav-header-box-mobile" isDarkMode={isDarkMode}>
          {currentUserAddress && isLoggedIn && (
            <li
              className="logout"
              style={{
                color: textColor
              }}
              onClick={logoutUser}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </li>
          )}
        </NavFooterBox>
      )}
    </NavFooter>
  );
};

export default MobileNavigationList;
