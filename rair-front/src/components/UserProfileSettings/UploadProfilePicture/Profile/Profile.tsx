//@ts-nocheck
import React, { memo } from 'react';

import cl from './Profile.module.css';

const ProfileComponent = ({
  onSubmit,
  src,
  name,
  status,
  setOpenModalPic,
  setTriggerState,
  primaryColor
}) => {
  const onCloseEditProfile = () => {
    setTriggerState(false);
    setOpenModalPic(false);
  };

  return (
    <div
      style={{
        background: primaryColor === 'rhyno' ? 'rgb(192, 192, 192)' : '#383637'
      }}
      className={cl.card}>
      <form onSubmit={onSubmit}>
        <h1> </h1>
        <label className={`${cl.customFileUpload} ${'fas'}`}>
          <div className={cl.imgWrap}>
            <img alt="User Avatar" htmlFor={cl.photoUpload} src={src} />
          </div>
        </label>
        <div className={cl.name}>{name}</div>
        <div className={cl.status}>{status}</div>
        <button type="submit" className={cl.edit}>
          Edit Profile{' '}
        </button>
        <button onClick={onCloseEditProfile} className={cl.edit}>
          Exit{' '}
        </button>
      </form>
    </div>
  );
};

export const Profile = memo(ProfileComponent);
