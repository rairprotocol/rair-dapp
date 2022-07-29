//@ts-nocheck
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setColorScheme } from '../../../ducks/colors/actions';
import {
  SocialBox,
  SocialBoxSearch,
  UserIconMobile
} from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { BellIcon, SunIcon } from '../../Header/DiscordIcon';
import { SvgUserIcon } from '../../UserProfileSettings/SettingsIcons/SettingsIcons';

const MobileChoiseNav = ({
  click,
  messageAlert,
  currentUserAddress,
  handleMessageAlert,
  activeSearch,
  handleActiveSearch,
  userData
}) => {
  const { primaryColor, headerLogoMobile } = useSelector(
    (store) => store.colorStore
  );
  const dispatch = useDispatch();

  return (
    <div className="burder-menu-logo">
      {click ? (
        <div className="social-media">
          {messageAlert && messageAlert === 'profile' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}>
              <UserIconMobile
                onClick={() => handleMessageAlert('profile')}
                avatar={userData && userData.avatar}
                marginRight={'16px'}
                messageAlert={messageAlert}
                primaryColor={primaryColor}>
                {userData && !userData.avatar && (
                  <SvgUserIcon width={'22.5px'} height={'22.5px'} />
                )}
              </UserIconMobile>
              <div
                style={{
                  marginLeft: 10
                }}>
                {userData && userData.nickName.length > 13
                  ? userData.nickName.slice(0, 5) +
                    '...' +
                    userData.nickName.slice(length - 4)
                  : userData.nickName}
              </div>
            </div>
          ) : messageAlert === 'notification' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}>
              {currentUserAddress && (
                <SocialBox
                  className="social-bell-icon"
                  width="40px"
                  height="40px"
                  marginLeft={'17px'}>
                  <BellIcon primaryColor={primaryColor} />
                </SocialBox>
              )}
              <div
                style={{
                  marginLeft: 10
                }}>
                Notifications
              </div>
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
                      primaryColor === 'rhyno' ? 'charcoal' : 'rhyno'
                    )
                  );
                }}>
                <SunIcon primaryColor={primaryColor} />
              </SocialBox>
              <SocialBoxSearch
                primaryColor={primaryColor}
                onClick={handleActiveSearch}
                activeSearch={activeSearch}>
                <i className="fas fa-search" aria-hidden="true"></i>
              </SocialBoxSearch>
            </>
          )}
        </div>
      ) : (
        <NavLink to="/">
          <img src={headerLogoMobile} alt="logo_rair" />
        </NavLink>
      )}
    </div>
  );
};

export default MobileChoiseNav;
