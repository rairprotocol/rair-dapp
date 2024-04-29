//@ts-nocheck
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PopUpSettings from './PopUpSetting';

// React Redux types
import { setColorScheme } from '../../ducks/colors/actions';
import { getUserStart } from '../../ducks/users/actions';
import { SunIcon } from '../../images';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';
import { TooltipBox } from '../common/Tooltip/TooltipBox';

import './UserProfileSettings.css';

const UserProfileSettings = ({
  adminAccess,
  showAlert,
  selectedChain,
  setTabIndexItems,
  isSplashPage
}) => {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector((store) => store.userStore);
  const { primaryColor } = useSelector((store) => store.colorStore);
  const { currentUserAddress } = useSelector((store) => store.contractStore);

  useEffect(() => {
    if (currentUserAddress) {
      dispatch(getUserStart(currentUserAddress));
    }
  }, [currentUserAddress, dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <TooltipBox position={'bottom'} title="Switch Theme">
          <SocialBox
            className="social-sun-icon"
            primaryColor={primaryColor}
            marginRight={'17px'}
            onClick={() => {
              dispatch(
                setColorScheme(
                  primaryColor === '#dedede' ? 'charcoal' : 'rhyno'
                )
              );
            }}>
            <SunIcon primaryColor={primaryColor} color={'#fff'} />
          </SocialBox>
        </TooltipBox>
        {loggedIn && (
          <div
            style={{
              marginRight: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            className="user-block">
            <PopUpSettings
              primaryColor={primaryColor}
              adminAccess={adminAccess}
              showAlert={showAlert}
              selectedChain={selectedChain}
              setTabIndexItems={setTabIndexItems}
              isSplashPage={isSplashPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSettings;
