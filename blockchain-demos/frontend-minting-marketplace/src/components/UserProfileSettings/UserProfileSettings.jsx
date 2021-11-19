import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './UserProfileSettings.css';

// React Redux types
import * as colorTypes from './../../ducks/colors/types';
import PopUpSettings from './PopUpSetting';
import PopUpNotification from './PopUpNotification/PopUpNotification';

const UserProfileSettings = ({ loginDone, currentUserAddress, adminAccess, setLoginDone }) => {
    const dispatch = useDispatch();
    const { primaryColor } = useSelector(store => store.colorStore);

    return (
        <div style={{ position: 'absolute', display: "flex", alignContent: "center", top: '1rem', right: '3rem' }}>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                {
                    loginDone && <div style={{ marginRight: "12px" }} className="user-block">
                        <PopUpNotification primaryColor={primaryColor} />
                        <PopUpSettings
                            primaryColor={primaryColor}
                            setLoginDone={setLoginDone}
                            adminAccess={adminAccess}
                            currentUserAddress={currentUserAddress}
                        />
                    </div>
                }
            </div>
            <div>
                <button style={{
                    color: 'var(--royal-purple)',
                    border: 'solid 1px var(--royal-purple)',
                    backgroundColor: primaryColor === "charcoal" ? "#222021" : "#D3D2D3",
                    borderRadius: '12px',
                    width: 32,
                    height: 32,
                    fontSize: 18
                }}
                    onClick={e => {
                        dispatch({ type: colorTypes.SET_COLOR_SCHEME, payload: primaryColor === 'rhyno' ? 'charcoal' : 'rhyno' });
                    }}>
                    {primaryColor === 'rhyno' ? <i className='far fa-moon' /> : <i className='fas fa-sun' />}
                </button>
            </div>
        </div>
    )
}

export default UserProfileSettings