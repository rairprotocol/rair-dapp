import React, { useState } from 'react';
import { List, ListProfileItem, ProfileButtonBack } from './../NavigationItems/NavigationItems';
import MobileEditProfile from './MobileEditProfile';


const MobileProfileInfo = ({ primaryColor, click, toggleOpenProfile, userData, editMode, toggleEditMode }) => {
    return (
        <List primaryColor={primaryColor} click={click}>
            {
                editMode ? <MobileEditProfile /> : <ListProfileItem>
                    <ProfileButtonBack onClick={toggleOpenProfile}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
                    {userData && <div className="burger-menu-profile">
                        {userData.avatar && <div><img className="burger-menu-avatar" src={userData.avatar} alt="avatar" /></div>}
                        <div style={{ margin: "10px 0" }}>Name: {userData.nickName && userData.nickName.substr(0, 20) + "..."}</div>
                        <div>Email: {userData.email}</div>
                        <button onClick={toggleEditMode} className="btn-edit-mobileProfile">Edit</button>
                    </div>}
                </ListProfileItem>
            }
        </List>
    )
}

export default MobileProfileInfo