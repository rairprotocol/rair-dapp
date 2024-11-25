import { useCallback } from 'react';
import { Provider, useStore } from 'react-redux';

import { useAppDispatch, useAppSelector } from '../../../../hooks/useReduxHooks';
import useSwal from '../../../../hooks/useSwal';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { CloseIconMobile } from '../../../../images';
import { fetchNotifications } from '../../../../redux/notificationsSlice';
import { SocialMenuMobile } from '../../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../../utils/rFetch';
import NotificationPage from '../../NotificationPage/NotificationPage';

import './NotificationBox.css';

const NotificationBox = ({
  title,
  el,
}) => {
  const { headerLogoMobile, primaryColor, isDarkMode } = useAppSelector(
    (store) => store.colors
  );
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const { width } = useWindowDimensions();

  const dispatch = useAppDispatch();

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
        dispatch(fetchNotifications(0));
      }
    }
  }, [currentUserAddress, el._id]);

  const readNotification = useCallback(async () => {
    if (currentUserAddress) {
      if(!el.read) {
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
          dispatch(fetchNotifications(0));
        }
      }
    }
  }, [currentUserAddress, el._id]);

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
    });
  };

  return (
    <div className="notification-from-factory">
      <div className="box-notification"  style={{
        border: width < 1024 ? `1px solid ${isDarkMode ? "#fff" : "#000"}` : 'none'
      }}>
        <div className="box-dot-img">
          {!el.read && <div className="dot-notification" />}
          <div className="notification-img">
            <img src={headerLogoMobile} alt="Exclusive NFT token by RAIR" />
          </div>
        </div>
        <div className="text-notification">
          <div
            onClick={() => {
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
