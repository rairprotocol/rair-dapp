import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { RootState } from '../../../ducks';
import { setColorScheme } from '../../../ducks/colors/actions';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import { BellIcon, SunIcon } from '../../../images';
import {
  SocialBox,
  UserIconMobile
} from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { rFetch } from '../../../utils/rFetch';
import { SvgUserIcon } from '../../UserProfileSettings/SettingsIcons/SettingsIcons';

interface IMobileChoiseNav {
  click: boolean;
  messageAlert: string | null;
  currentUserAddress: string | undefined;
  handleMessageAlert: (arg: string) => void;
  activeSearch: boolean;
  handleActiveSearch: () => void;
}

const MobileChoiseNav: React.FC<IMobileChoiseNav> = ({
  click,
  messageAlert,
  currentUserAddress,
  handleMessageAlert
}) => {
  const { primaryColor, headerLogoMobile } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const dispatch = useDispatch();
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (state) => state.userStore
  );
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const getNotificationsCount = useCallback( async () => {
    if (currentUserAddress) {
      const result = await rFetch(`/api/notifications?onlyUnread=true`);
      if (result.success && result.totalCount >= 0) {
        setNotificationCount(result.totalCount);
      }
    }
  }, [currentUserAddress, messageAlert])

  useEffect(() => {
    getNotificationsCount();
  }, [getNotificationsCount])

  return (
    <div className="burder-menu-logo">
      {click ? (
        <div className="social-media">
          {(messageAlert && messageAlert === 'profile') ||
          messageAlert === 'profileEdit' ? (
            <div className="social-media-profile">
              <UserIconMobile
                onClick={() => handleMessageAlert('profile')}
                avatar={userRd && userRd.avatar}
                marginRight={'16px'}
                messageAlert={messageAlert}
                primaryColor={primaryColor}>
                {userRd && !userRd.avatar && (
                  <SvgUserIcon width={'22.5px'} height={'22.5px'} />
                )}
              </UserIconMobile>
              <div>
                {userRd && (
                  <>
                    {userRd.nickName && userRd.nickName.length > 13
                      ? userRd.nickName.slice(0, 5) +
                        '...' +
                        userRd.nickName.slice(userRd.nickName.length - 4)
                      : userRd.nickName}
                  </>
                )}
              </div>
            </div>
          ) : messageAlert === 'notification' ? (
            <div className="social-media-profile">
              {currentUserAddress && (
                <SocialBox
                  className="social-bell-icon notifications"
                  width="40px"
                  height="40px"
                  marginLeft={'17px'}>
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
              )}
              <div className="social-media-user-icon">Notifications</div>
            </div>
          ) : (
            <>
              <SocialBox
                className="social-sun-icon"
                primaryColor={primaryColor}
                marginRight={'17px'}
                width={'40px'}
                height={'40px'}
                onClick={() => {
                  dispatch(
                    setColorScheme(
                      primaryColor === '#dedede' ? 'charcoal' : 'rhyno'
                    )
                  );
                }}>
                <SunIcon primaryColor={primaryColor} />
              </SocialBox>
            </>
          )}
        </div>
      ) : (
        <NavLink to="/">
          <img src={headerLogoMobile} alt="Rair Tech" />
        </NavLink>
      )}
    </div>
  );
};

export default MobileChoiseNav;
