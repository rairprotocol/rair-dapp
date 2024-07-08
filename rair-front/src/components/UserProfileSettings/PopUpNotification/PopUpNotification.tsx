//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Popup } from 'reactjs-popup';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import { BellIcon } from '../../../images';
import { SocialBox } from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';

import NotificationBox from './NotificationBox/NotificationBox';

const PopUpNotification = ({getNotifications, realDataNotification, notificationCount, getNotificationsCount, setRealDataNotification}) =>
  // props was - isNotification
  {
    const currentName =
      import.meta.env.VITE_TESTNET === 'true' ? 'HotDrops' : 'Rair.tech';
    const [openModal, setOpenModal] = useState(false);
    const store = useStore();
    const { currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);
    const { primaryColor, primaryButtonColor, textColor } = useSelector<
      RootState,
      ColorStoreType
    >((store) => store.colorStore);
    const { uploadVideo } = useSelector<RootState, any>(
      (store) => store.videoDemoStore
    );
    const { userRd } = useSelector<RootState, TUsersInitialState>(
      (store) => store.userStore
    );

    useEffect(() => {
      if(openModal) {
        getNotifications();
        getNotificationsCount();
      }
    }, [openModal]);

    const onCloseNext = useCallback(() => {
      if (!openModal) {
        setOpenModal(false);
      }
    }, [openModal]);

    useEffect(() => {
      onCloseNext();
    }, [onCloseNext]);

    useEffect(() => {
      if (uploadVideo) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    }, [uploadVideo]);

    return (
      <>
        <SocialBox
          onClick={() => setOpenModal((prev) => !prev)}
          className="social-bell-icon notifications"
          marginRight={'17px'}
          notification={true}>
          {uploadVideo && userRd?.email && <span></span>}
          <BellIcon primaryColor={primaryColor} />
          {notificationCount > 0 && (
            <div style={{
              fontSize: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: '#fff'
            }} className="red-circle-notifications">{notificationCount  > 9 ? "9+" : notificationCount}</div>
          )}
        </SocialBox>
        <Popup
          className={`popup-notification-block`}
          open={openModal}s
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
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div className="btn-clear-nofitications">
                 <div className="notification-title">Notifications</div>
                 <button onClick={() => setRealDataNotification([])} style={{
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
          }}>Clear all</button>
                </div>
              {realDataNotification && realDataNotification.length > 0 ? (
                realDataNotification.map((el) => {
                  return (
                    <NotificationBox
                    currentUserAddress={currentUserAddress}
                    getNotificationsCount={getNotificationsCount}
                      getNotifications={getNotifications}
                      el={el}
                      key={el._id}
                      title={el.message}
                      primaryColor={primaryColor}
                    />
                  )
                })
              ) : (
                <div
                  style={{
                    padding: '25px'
                  }}>
                  You don't have any notifications now
                </div>
              )}
            </div>
          )}
        </Popup>
      </>
    );
  };

export default PopUpNotification;
