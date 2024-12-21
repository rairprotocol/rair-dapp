import { useCallback, useEffect, useState } from 'react';
import { Popup } from 'reactjs-popup';

import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { BellIcon } from '../../../images';
import { fetchNotifications } from '../../../redux/notificationsSlice';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../utils/rFetch';
import PaginationBox from '../../MockUpPage/PaginationBox/PaginationBox';

import NotificationBox from './NotificationBox/NotificationBox';

const PopUpNotification = ({ realDataNotification, notificationCount }) => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const reactSwal = useSwal();
  const { currentUserAddress } = useAppSelector((state) => state.web3);
  const { isLoggedIn } = useAppSelector((store) => store.user);
  const { totalUnreadCount, totalCount } = useAppSelector(
    (store) => store.notifications
  );
  const [totalPageForPagination, setTotalPageForPagination] = useState(0);
  const [currentPageForNotification, setCurrentPageNotification] =
    useState<number>(1);
  const { primaryColor, primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const { email } = useAppSelector((store) => store.user);

  const changePageForNotification = (currentPage: number) => {
    setCurrentPageNotification(currentPage);
    const currentPageNumber = currentPage === 0 ? currentPage : currentPage - 1;
    dispatch(fetchNotifications(Number(currentPageNumber)));
  };

  const getNotificationsCountPagitation = useCallback(async () => {
    if (currentUserAddress && isLoggedIn) {
      setTotalPageForPagination(notificationCount);
    } else {
      setTotalPageForPagination(0);
    }
  }, [currentUserAddress, isLoggedIn, notificationCount]);

  const deleteAllNotificaiton = useCallback(async () => {
    if (currentUserAddress) {
      const result = await rFetch(`/api/notifications`, {
        method: 'DELETE',
        body: JSON.stringify([])
      });

      if (result.success) {
        dispatch(fetchNotifications(0));
        reactSwal.fire({
          title: 'Success',
          icon: 'success'
        });
      }
    }
  }, [currentUserAddress, reactSwal]);

  useEffect(() => {
    if (openModal) {
      dispatch(fetchNotifications(0));
    }
  }, [dispatch, openModal]);

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
      {currentUserAddress && isLoggedIn && (
        <SocialBox
          onClick={() => setOpenModal((prev) => !prev)}
          className="social-bell-icon notifications"
          marginRight={'17px'}
          notification={true}>
          {email && <span></span>}
          <BellIcon primaryColor={primaryColor} />
          {totalUnreadCount > 0 && (
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
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </div>
          )}
        </SocialBox>
      )}
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
                    <NotificationBox el={el} key={el._id} title={el.message} />
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
                    changePage={changePageForNotification}
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
