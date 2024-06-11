import React from 'react'
import { CloseIconMobile } from '../../../../images';
import { SocialMenuMobile } from '../../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import NftImg from './../images/image.png';
import "./NotificationBox.css";

const NotificationBox = ({primaryColor, time, title, setNotificationArray, notificationArray, el}) => {
    const removeItem = () => {
        setNotificationArray(notificationArray.filter(item => item.id !== el.id));
    }


  return (
    <div className="notification-from-factory">
              <div className="box-notification">
                <div className="box-dot-img">
                <div className="dot-notification" />
                <div className="notification-img">
                  <img src={NftImg} alt="Exclusive NFT token by RAIR" />
                </div>
                </div>
                <div className="text-notification">
                  <div className="title-notif">{title}</div>
                  <div className="text-notif">
                    Your nft “<span>Pegayo</span>” has been listed
                  </div>
                </div>
                <div
                  className="time-notification"
                  style={{
                    color: `${primaryColor === 'rhyno' && '#000'}`
                  }}>
                  {time}
                </div>
                <div>
                <SocialMenuMobile primaryColor={primaryColor} onClick={() => removeItem()}>
              <CloseIconMobile primaryColor={primaryColor} />
            </SocialMenuMobile>
                </div>
              </div>
            </div>
  )
}

export default NotificationBox