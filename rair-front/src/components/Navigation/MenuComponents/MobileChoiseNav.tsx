import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import { BellIcon, SunIcon } from '../../../images';
import { setColorScheme } from '../../../redux/colorSlice';
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
  handleMessageAlert
}) => {
  const { primaryColor, headerLogoMobile, isDarkMode } = useAppSelector(
    (store) => store.colors
  );
  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const dispatch = useAppDispatch();
  const { nickName, isLoggedIn, avatar } = useAppSelector(
    (state) => state.user
  );

  const {totalUnreadCount} = useAppSelector(store => store.notifications);

  return (
    <div className="burder-menu-logo">
      {click ? (
        <div className="social-media">
          {(messageAlert && messageAlert === 'profile') ||
          messageAlert === 'profileEdit' ? (
            <div className="social-media-profile">
              <UserIconMobile
                onClick={() => handleMessageAlert('profile')}
                avatar={avatar}
                marginRight={'16px'}
                messageAlert={messageAlert}
                primaryColor={primaryColor}>
                {isLoggedIn && !avatar && (
                  <SvgUserIcon width={'22.5px'} height={'22.5px'} />
                )}
              </UserIconMobile>
              <div>
                {isLoggedIn && (
                  <>
                    {nickName && nickName.length > 13
                      ? nickName.slice(0, 5) +
                        '...' +
                        nickName.slice(nickName.length - 4)
                      : nickName}
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
                  dispatch(setColorScheme(isDarkMode ? 'light' : 'dark'));
                }}>
                <SunIcon />
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
