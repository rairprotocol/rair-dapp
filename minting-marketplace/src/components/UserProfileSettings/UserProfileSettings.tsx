//@ts-nocheck
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './UserProfileSettings.css';

// React Redux types
import PopUpSettings from './PopUpSetting';
import PopUpNotification from './PopUpNotification/PopUpNotification';
import { setColorScheme } from '../../ducks/colors/actions';
import { SunIcon } from '../Header/DiscordIcon';
import { SocialBox } from '../../styled-components/SocialLinkIcons/SocialLinkIcons';

const UserProfileSettings = ({
  loginDone,
  currentUserAddress,
  adminAccess,
  setLoginDone,
  userData,
  showAlert,
  selectedChain
}) => {
  const dispatch = useDispatch();
  const { primaryColor } = useSelector((store) => store.colorStore);

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
            />
          </div>
        )}
      </div>
      <div>
        {/* <button
          className="btn-change-theme"
          style={{
            backgroundColor: primaryColor === 'charcoal' ? '#222021' : '#D3D2D3'
          }}
          onClick={(e) => {
            dispatch(
              setColorScheme(primaryColor === 'rhyno' ? 'charcoal' : 'rhyno')
            );
          }}>
          {primaryColor === 'rhyno' ? (
            <i className="far fa-moon" />
          ) : (
            <SunIcon primaryColor={primaryColor} color={'#fff'} />
          )}
        </button> */}
      </div>
    </div>
  );
};

export default UserProfileSettings;
