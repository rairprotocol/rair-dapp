import React, { useCallback, useEffect, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';

import MobileEditProfile from './MobileEditProfile';

import { UserType } from '../../../ducks/users/users.types';

import defaultPictures from './../../UserProfileSettings/images/defaultUserPictures.png';
import {
  List,
  ListProfileItem,
  ListProfileLoading,
  ProfileButtonBack
} from './../NavigationItems/NavigationItems';

interface IMobileProfileInfo {
  primaryColor: string;
  click: boolean;
  toggleOpenProfile: () => void;
  userData: UserType | null;
}

const MobileProfileInfo: React.FC<IMobileProfileInfo> = ({
  primaryColor,
  click,
  toggleOpenProfile,
  userData
}) => {
  const [profileData, setProfileData] = useState(userData);
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  useEffect(() => {
    if (profileData !== userData) {
      setProfileData(userData);
    }
  }, [setProfileData, userData, profileData]);

  const onScrollChange = useCallback(() => {
    if (editMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [editMode]);

  useEffect(() => {
    onScrollChange();
  }, [onScrollChange]);

  if (!userData) {
    return (
      <List primaryColor={primaryColor} click={click}>
        <ListProfileItem>
          <ListProfileLoading>
            <ProfileButtonBack onClick={toggleOpenProfile}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ProfileButtonBack>
            <div className="mobile-profile-preloader">
              <CircularProgress />
            </div>
          </ListProfileLoading>
        </ListProfileItem>
      </List>
    );
  }

  return (
    <List primaryColor={primaryColor} click={click}>
      {editMode ? (
        <MobileEditProfile />
      ) : (
        <ListProfileItem>
          <ProfileButtonBack onClick={toggleOpenProfile}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </ProfileButtonBack>
          {profileData && (
            <div className="burger-menu-profile">
              {profileData.avatar ? (
                <div className="block-avatar-profile">
                  <img src={profileData.avatar} alt="Your Profile avatar" />
                </div>
              ) : (
                <div className="block-avatar-profile">
                  <img src={defaultPictures} alt="Your Profile avatar" /> :
                </div>
              )}
              <div className={'block-user-profile'}>
                Name: {profileData.nickName}
              </div>
              <div>Email: {profileData.email}</div>
              <button
                onClick={toggleEditMode}
                className="btn-edit-mobileProfile">
                Edit
              </button>
            </div>
          )}
        </ListProfileItem>
      )}
    </List>
  );
};

export default MobileProfileInfo;
