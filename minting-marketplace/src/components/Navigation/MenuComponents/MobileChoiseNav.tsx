import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../../../ducks';
import { setColorScheme } from '../../../ducks/colors/actions';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { TUsersInitialState } from '../../../ducks/users/users.types';
import {
  SocialBox,
  SocialBoxSearch,
  UserIconMobile
} from '../../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { BellIcon, SunIcon } from '../../Header/DiscordIcon';
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
  handleMessageAlert,
  activeSearch,
  handleActiveSearch
}) => {
  const { primaryColor, headerLogoMobile } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const dispatch = useDispatch();
  const { userRd } = useSelector<RootState, TUsersInitialState>(
    (state) => state.userStore
  );

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
                  className="social-bell-icon"
                  width="40px"
                  height="40px"
                  marginLeft={'17px'}>
                  <BellIcon primaryColor={primaryColor} />
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
          <img src={headerLogoMobile} alt="Rair Tech" />
        </NavLink>
      )}
    </div>
  );
};

export default MobileChoiseNav;
