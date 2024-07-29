import { useCallback } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import useSwal from '../../../../hooks/useSwal';
import { CloseIconMobile } from '../../../../images';
import { SocialMenuMobile } from '../../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../../utils/rFetch';
import NotificationPage from '../../NotificationPage/NotificationPage';

import './NotificationBox.css';

const NotificationBox = ({
  primaryColor,
  title,
  el,
  getNotifications,
  currentUserAddress,
  getNotificationsCount
}) => {
  const { headerLogoMobile } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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
  }, [currentUserAddress]);

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
  }, [currentUserAddress]);

  const showMoreDetails = () => {
    reactSwal.fire({
      html: (
        <Provider store={store}>
          <NotificationPage
            el={el}
            readNotification={readNotification}
            removeItem={removeItem}
          />
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
