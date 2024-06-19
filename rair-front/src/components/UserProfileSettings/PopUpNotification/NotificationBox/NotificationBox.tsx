import React from 'react';
import { Provider, useStore } from 'react-redux';
import Swal from 'sweetalert2';

import useSwal from '../../../../hooks/useSwal';
import { CloseIconMobile } from '../../../../images';
import { SocialMenuMobile } from '../../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../../utils/rFetch';
import NotificationPage from '../../NotificationPage/NotificationPage';

import NftImg from './../images/image.png';

import './NotificationBox.css';

const NotificationBox = ({ primaryColor, title, el, getNotifications, openNotificationModal }) => {
  const reactSwal = useSwal();
  const store = useStore();

  const removeItem = async () => {
    const result = await rFetch(`/api/notifications/${el._id}`, {
      method: 'DELETE'
    });

    if (result.success) {
      getNotifications();
    }

    console.info(result, 'result');
  };

  const readNotification = async () => {
    const result = await rFetch(`/api/notifications/${el._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...el,
        read: true
      })
    });

    if (result.success) {
      getNotifications();
    }
  };

  const showMoreDetails = () => {
    reactSwal.fire({
      html: <Provider store={store}>
        <NotificationPage el={el} readNotification={readNotification} removeItem={removeItem} />
      </Provider>,
      width: '90vw',
      customClass: {
        popup: `bg-${primaryColor}`
      },
      showConfirmButton: false,
      showCloseButton: true
      // cancelButtonText:
      //     '<i class="fa fa-thumbs-down"></i>',
      // cancelButtonAriaLabel: 'Thumbs down'
    });
  };

  return (
    <div className="notification-from-factory">
      <div className="box-notification">
        <div className="box-dot-img">
          {!el.read && <div className="dot-notification" />}
          <div className="notification-img">
            <img src={NftImg} alt="Exclusive NFT token by RAIR" />
          </div>
        </div>
        <div className="text-notification">
          <div
            onClick={() => {
            //   readNotification();
            showMoreDetails()
            }}
            className="title-notif">
            {title && title.length > 35 ? title.substr(0, 35) + "..." : title}
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
