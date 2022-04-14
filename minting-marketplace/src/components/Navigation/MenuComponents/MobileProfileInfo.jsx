import React, { Suspense, useEffect, useState } from 'react';
import { List, ListProfileItem, ProfileButtonBack } from './../NavigationItems/NavigationItems';
import MobileEditProfile from './MobileEditProfile';


const MobileProfileInfo = ({
    primaryColor,
    click,
    toggleOpenProfile,
    userData,
    editMode,
    toggleEditMode,
    currentUserAddress,
    loading }) => {
    const [profileData, setProfileData] = useState(userData);


    useEffect(() => {
        if(profileData !== userData) {
            setProfileData(userData);
        }
    }, [setProfileData, userData]);

    if (profileData !== userData) {
        return <List primaryColor={primaryColor} click={click}>
            <div>...loading</div>
        </List>
    }

    return (
        <List primaryColor={primaryColor} click={click}>
            {
                editMode ? <Suspense fallback={<h1>Loading profile...</h1>}>
                    {userData && <MobileEditProfile
                        editMode={editMode}
                        userData={profileData}
                        toggleEditMode={toggleEditMode}
                        currentUserAddress={currentUserAddress}
                    />}
                </Suspense> : <ListProfileItem>
                    <ProfileButtonBack onClick={toggleOpenProfile}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
                    {profileData && <div className="burger-menu-profile">
                        {profileData.avatar && <div className="block-avatar-profile">
                            <img src={profileData.avatar} alt="avatar" />
                        </div>}
                        <div style={{ margin: "10px 0" }}>Name: {profileData.nickName && profileData.nickName.substr(0, 20) + "..."}</div>
                        <div>Email: {profileData.email}</div>
                        <button onClick={toggleEditMode} className="btn-edit-mobileProfile">Edit</button>
                    </div>}
                </ListProfileItem>
            }
        </List>
    )
}

export default MobileProfileInfo