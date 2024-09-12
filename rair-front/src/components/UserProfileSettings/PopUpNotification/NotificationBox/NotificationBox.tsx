import { useCallback } from 'react';
import { Provider, useStore } from 'react-redux';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import useSwal from '../../../../hooks/useSwal';
import { CloseIconMobile } from '../../../../images';
import { SocialMenuMobile } from '../../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../../utils/rFetch';
import NotificationPage from '../../NotificationPage/NotificationPage';

import './NotificationBox.css';

const NotificationBox = ({
  title,
  el,
  getNotifications,
  getNotificationsCount
}) => {
  const { headerLogoMobile, primaryColor } = useAppSelector(
    (store) => store.colors
  );
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const reactSwal = useSwal();
  const store = useStore();

  const removeItem = useCallback(async () => {
    if (currentUserAddress) {
      const result = await rFetch(`/api/notifications`, {
        method: 'DELETE',
        body: JSON.stringify({
          ids: [el._id]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.success) {
        getNotifications();
        getNotificationsCount();
      }
    }
  }, [currentUserAddress, el._id, getNotifications, getNotificationsCount]);

  const readNotification = useCallback(async () => {
    if (currentUserAddress) {
      const result = await rFetch(`/api/notifications`, {
        method: 'PUT',
        body: JSON.stringify({
          ids: [el._id]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.success) {
        getNotifications();
        getNotificationsCount();
      }
    }
  }, [currentUserAddress, el._id, getNotifications, getNotificationsCount]);

  const showMoreDetails = () => {
    reactSwal.fire({
      html: (
        <Provider store={store}>
          <NotificationPage el={el} readNotification={readNotification} />
        </Provider>
      ),
      width: '90vw',
      customClass: {
        popup: `bg-${primaryColor}`
      },
      showConfirmButton: false,
      showCloseButton: true
      // cancelButtonText:
      //     '<FontAwesomeIcon icon={faThumbsDown} />',
      // cancelButtonAriaLabel: 'Thumbs down'
    });
  };

  return (
    <div className="notification-from-factory">
      <div className="box-notification">
        <div className="box-dot-img">
          {!el.read && <div className="dot-notification" />}
          <div className="notification-img">
            <img src={headerLogoMobile} alt="Exclusive NFT token by RAIR" />
          </div>
        </div>
        <div className="text-notification">
          <div
            onClick={() => {
              //   readNotification();
              showMoreDetails();
              readNotification();
            }}
            className="title-notif">
            {title && title.length > 35 ? title.substr(0, 35) + '...' : title}
          </div>
        </div>
        <div>
          <SocialMenuMobile primaryColor={primaryColor} onClick={removeItem}>
            <CloseIconMobile primaryColor={primaryColor} />
          </SocialMenuMobile>
        </div>
      </div>
    </div>
  );
};

export default NotificationBox;
