import { FC, useEffect } from 'react';

import { useAppSelector } from '../../../hooks/useReduxHooks';

import './NotificationPage.css';

interface NotificationPageProps {
  el?: any;
  readNotification?: () => void;
}

const NotificationPage: FC<NotificationPageProps> = ({
  el,
  readNotification
}) => {
  const { headerLogoMobile, primaryColor } = useAppSelector(
    (store) => store.colors
  );

  useEffect(() => {
    if (readNotification) {
      readNotification();
    }
  }, []);

  return (
    <div
      className={`wrapper-notification ${primaryColor === '#dedede' ? 'rhyno' : ''}`}>
      <div className="notification-from-rair">
        <div className="notification-new">
          <div
            className="notification-main-text"
            style={{
              color: `${primaryColor === 'rhyno' && '#000'}`
            }}>
            Viewed
          </div>
          <div
            className="box-notification"
            style={{
              backgroundColor: `${primaryColor === 'rhyno' && '#c0c0c0'}`
            }}>
            <div className="notification-left">
              <div className="notification-img">
                <img src={headerLogoMobile} alt="Rair Tech" />
              </div>
              {el && (
                <div className="text-notification">
                  <div className="title-notif">{el.message}</div>
                  <div className="text-notif">{el.title}</div>
                </div>
              )}
            </div>
            <div className="notification-right">
              {/* <div
                className="time-notification"
                style={{
                  color: `${primaryColor === 'rhyno' && '#000'}`
                }}>
                3 hours ago
              </div> */}
              {/* <div onClick={() => {removeItem}} className="icon-remove">
                <img src={IconRemove} alt="Close notification item" />
              </div> */}
            </div>
          </div>
        </div>
        <div className="notification-viewed">
          {/* <div
            className="box-notification"
            style={{
              backgroundColor: `${primaryColor === 'rhyno' && '#c0c0c0'}`
            }}>
            <div className="notification-left">
              <div className="dot-notification" />
              <div className="notification-img">
                <img src={headerLogo} alt="Rair Tech" />
              </div>
              <div className="text-notification">
                <div className="title-notif">Notification from Rair.tech</div>
                <div className="text-notif">
                  New announcements coming next Friday
                </div>
              </div>
            </div>
            <div className="notification-right">
              <div
                className="time-notification"
                style={{
                  color: `${primaryColor === 'rhyno' && '#000'}`
                }}>
                3 hours ago
              </div>
              <div className="icon-remove">
                <img src={IconRemove} alt="Close notification item" />
              </div>
            </div>
          </div> */}
          {/* <div
            className="box-notification"
            style={{
              backgroundColor: `${primaryColor === 'rhyno' && '#c0c0c0'}`
            }}>
            <div className="notification-left">
              <div className="dot-notification" />
              <div className="notification-img">
                <img src={NftImg} alt="Exclusive NFT token" />
              </div>
              <div className="text-notification">
                <div className="title-notif">Factory updates</div>
                <div className="text-notif">
                  Your nft “<span>Pegayo</span>” has been listed
                </div>
              </div>
            </div>
            <div className="notification-right">
              <div
                className="time-notification"
                style={{
                  color: `${primaryColor === 'rhyno' && '#000'}`
                }}>
                5 hours ago
              </div>
              <div className="icon-remove">
                <img src={IconRemove} alt="Close notification item" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
