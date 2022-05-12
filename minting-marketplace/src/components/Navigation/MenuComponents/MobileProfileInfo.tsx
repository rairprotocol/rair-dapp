//@ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { List, ListProfileItem, ListProfileLoading, ProfileButtonBack } from './../NavigationItems/NavigationItems';
import MobileEditProfile from './MobileEditProfile';
import CircularProgress from '@mui/material/CircularProgress';
import defaultPictures from './../../UserProfileSettings/images/defaultUserPictures.png';


const MobileProfileInfo = ({
    primaryColor,
    click,
    toggleOpenProfile,
    userData,
    currentUserAddress,
    loading,
    setUserData
}) => {
    const [profileData, setProfileData] = useState(userData);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
    }, [setEditMode])


    useEffect(() => {
        if (profileData !== userData) {
            setProfileData(userData);
        }
    }, [setProfileData, userData, profileData]);

    const onScrollChange = useCallback(() => {
        if (editMode) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
    }, [editMode])

    useEffect(() => {
        onScrollChange()
    }, [onScrollChange])

    if (!userData) {
        return <List primaryColor={primaryColor} click={click}>
            <ListProfileItem>
                <ListProfileLoading>
                    <ProfileButtonBack onClick={toggleOpenProfile}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
                    <div className="mobile-profile-preloader"><CircularProgress /></div>
                </ListProfileLoading>
            </ListProfileItem>
        </List >
    }

    return (
        <List primaryColor={primaryColor} click={click}>
            {
                editMode ?
                    <MobileEditProfile
                        editMode={true}
                        userData={profileData}
                        toggleEditMode={toggleEditMode}
                        setUserData={setUserData}
                        currentUserAddress={currentUserAddress}
                        defaultPictures={defaultPictures}
                    /> : <ListProfileItem>
                        <ProfileButtonBack onClick={toggleOpenProfile}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
                        {profileData && <div className="burger-menu-profile">
                            {profileData.avatar ? <div className="block-avatar-profile">
                                <img src={profileData.avatar} alt="avatar" />
                            </div> : <div className="block-avatar-profile">
                                <img src={defaultPictures} alt="avatar" /> :
                            </div>}
                            <div style={{ margin: "10px 0", wordBreak: "break-all" }}>Name: {profileData.nickName}</div>
                            <div>Email: {profileData.email}</div>
                            <button onClick={toggleEditMode} className="btn-edit-mobileProfile">Edit</button>
                        </div>}
                    </ListProfileItem>
            }
        </List>
    )
}

export default MobileProfileInfo