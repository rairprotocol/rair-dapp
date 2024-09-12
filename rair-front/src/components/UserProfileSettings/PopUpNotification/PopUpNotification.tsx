import { useCallback, useEffect, useState } from 'react';
import { Popup } from 'reactjs-popup';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { BellIcon } from '../../../images';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../utils/rFetch';
import PaginationBox from '../../MockUpPage/PaginationBox/PaginationBox';

import NotificationBox from './NotificationBox/NotificationBox';

const PopUpNotification = ({
  getNotifications,
  realDataNotification,
  notificationCount,
  getNotificationsCount
}) =>
  // props was - isNotification
  {
    const [openModal, setOpenModal] = useState(false);
    const reactSwal = useSwal();
    const { currentUserAddress } = useAppSelector((state) => state.web3);
    const [totalPageForPagination, setTotalPageForPagination] = useState(0);
    const [currentPageForNotification, setCurrentPageNotification] =
      useState<number>(1);
    const { primaryColor, primaryButtonColor, textColor } = useAppSelector(
      (store) => store.colors
    );
    const { email, isLoggedIn } = useAppSelector((store) => store.user);

    const changePageForVideo = (currentPage: number) => {
      setCurrentPageNotification(currentPage);
      const currentPageNumber =
        currentPage === 0 ? currentPage : currentPage - 1;
      getNotifications(Number(currentPageNumber));
    };

    const getNotificationsCountPagitation = useCallback(async () => {
      if (currentUserAddress && isLoggedIn) {
        const result = await rFetch(`/api/notifications`);
        if (result.success && result.totalCount > 0) {
          setTotalPageForPagination(result.totalCount);
        }
      } else {
        setTotalPageForPagination(0);
      }
    }, [currentUserAddress, isLoggedIn]);

    const deleteAllNotificaiton = useCallback(async () => {
      if (currentUserAddress) {
        const result = await rFetch(`/api/notifications`, {
          method: 'DELETE',
          body: JSON.stringify([])
        });

        if (result.success) {
          getNotifications();
          getNotificationsCount();
          reactSwal.fire({
            title: 'Success',
            icon: 'success'
          });
        }
      }
    }, [
      currentUserAddress,
      getNotifications,
      getNotificationsCount,
      reactSwal
    ]);

    useEffect(() => {
      if (openModal) {
        getNotifications(0);
        getNotificationsCount();
      }
    }, [getNotifications, getNotificationsCount, openModal]);

    useEffect(() => {
      getNotificationsCount();
    }, [getNotificationsCount]);

    useEffect(() => {
      getNotificationsCountPagitation();
    }, [getNotificationsCountPagitation]);

    const onCloseNext = useCallback(() => {
      if (!openModal) {
        setOpenModal(false);
      }
    }, [openModal]);

    useEffect(() => {
      onCloseNext();
    }, [onCloseNext]);

    return (
      <>
        <SocialBox
          onClick={() => setOpenModal((prev) => !prev)}
          className="social-bell-icon notifications"
          marginRight={'17px'}
          notification={true}>
          {email && <span></span>}
          <BellIcon primaryColor={primaryColor} />
          {notificationCount > 0 && (
            <div
              style={{
                fontSize: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                color: '#fff'
              }}
              className="red-circle-notifications">
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
        </SocialBox>
        <Popup
          className={`popup-notification-block`}
          open={openModal}
          closeOnDocumentClick
          onClose={() => {
            setOpenModal(false);
          }}>
          {openModal && (
            <div
              className={`pop-up-notification ${primaryColor === '#dedede' ? 'rhyno' : ''}`}
              style={{
                background: `${
                  primaryColor === '#dedede'
                    ? '#fff'
                    : `color-mix(in srgb, ${primaryColor}, #888888)`
                }`,
                border: '1px solid #fff',
                color: `${primaryColor === 'rhyno' && '#000'}`,
                maxHeight: '500px'
              }}>
              <div className="btn-clear-nofitications">
                <div className="notification-title">Notifications</div>
                <button
                  onClick={() => deleteAllNotificaiton()}
                  style={{
                    color: textColor,
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
                    }`
                  }}>
                  Clear all
                </button>
              </div>
              <div
                className="notification-wrapper-block"
                style={{
                  overflowY: 'auto',
                  maxHeight: '400px'
                  // marginTop: "20px"
                }}>
                {realDataNotification && realDataNotification.length > 0 ? (
                  realDataNotification.map((el) => {
                    return (
                      <NotificationBox
                        getNotificationsCount={getNotificationsCount}
                        getNotifications={getNotifications}
                        el={el}
                        key={el._id}
                        title={el.message}
                      />
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: '25px'
                    }}>
                    {"You don't have any notifications now"}
                  </div>
                )}
                <div style={{ paddingBottom: '15px' }}>
                  {notificationCount > 0 && totalPageForPagination && (
                    <PaginationBox
                      totalPageForPagination={totalPageForPagination}
                      changePage={changePageForVideo}
                      currentPage={currentPageForNotification}
                      itemsPerPageNotifications={10}
                      whatPage={'notifications'}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </Popup>
      </>
    );
  };

export default PopUpNotification;
