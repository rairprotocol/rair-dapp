//@ts-nocheck
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// React Redux types
import PopUpSettings from './PopUpSetting';

import { setColorScheme } from '../../ducks/colors/actions';
import { getUserStart } from '../../ducks/users/actions';
import { SunIcon } from '../../images';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';

import PopUpNotification from './PopUpNotification/PopUpNotification';

import './UserProfileSettings.css';

const UserProfileSettings = ({
  loginDone,
  currentUserAddress,
  adminAccess,
  setLoginDone,
  userData,
  showAlert,
  selectedChain,
  setTabIndexItems
}) => {
  const dispatch = useDispatch();
  const { primaryColor } = useSelector((store) => store.colorStore);

  useEffect(() => {
    if (currentUserAddress) {
      dispatch(getUserStart(currentUserAddress));
    }
  }, [currentUserAddress, dispatch]);

  return (
    <div
      style={{
        // position: "absolute",
        display: 'flex',
        alignContent: 'center'
        // marginRight: '16px'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {loginDone && (
          <PopUpNotification
            primaryColor={primaryColor}
            isNotification={false}
          />
        )}
        <SocialBox
          className="social-sun-icon"
          primaryColor={primaryColor}
          marginRight={'17px'}
          onClick={() => {
            dispatch(
              setColorScheme(primaryColor === 'rhyno' ? 'charcoal' : 'rhyno')
            );
          }}>
          <SunIcon primaryColor={primaryColor} color={'#fff'} />
        </SocialBox>
        {loginDone && (
          <div
            style={{
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            className="user-block">
            <PopUpSettings
              userData={userData}
              primaryColor={primaryColor}
              setLoginDone={setLoginDone}
              adminAccess={adminAccess}
              currentUserAddress={currentUserAddress}
              showAlert={showAlert}
              selectedChain={selectedChain}
              setTabIndexItems={setTabIndexItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileSettings;
