import React, { useState, useCallback, useEffect } from 'react'
import "./Menu.css";
import { useDispatch } from 'react-redux';
import * as colorTypes from "../../ducks/colors/types";
import * as authTypes from "../../ducks/auth/types";
import * as contractTypes from "../../ducks/contracts/types";
import { OnboardingButton } from '../common/OnboardingButton';
import { List, ListItem, ListProfileItem, Nav, ProfileButtonBack } from './NavigationItems/NavigationItems';
import { NavLink } from 'react-router-dom';

const MenuNavigation = ({
    headerLogo,
    primaryColor,
    connectUserData,
    startedLogin,
    programmaticProvider,
    renderBtnConnect,
    loginDone,
    setLoginDone,
    currentUserAddress
}) => {
    const [click, setClick] = useState(false);
    const [userData, setUserData] = useState(null)
    const [openProfile, setOpenProfile] = useState(false);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setClick(prev => !prev);
    }

    const toggleOpenProfile = () => {
        setOpenProfile(prev => !prev);
    }

    const logout = () => {
        dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: null });
        dispatch({ type: contractTypes.SET_USER_ADDRESS, payload: undefined });
        localStorage.removeItem("token");
        setLoginDone(false);
        toggleMenu();
    };

    const getInfoFromUser = useCallback(async () => {
        // find user
        const result = await fetch(`/api/users/${currentUserAddress}`).then(
            (blob) => blob.json()
        );

        if(result.success) {
            setUserData(result.user);
        }

    }, [currentUserAddress]);

    useEffect(() => {
        getInfoFromUser();
    }, [getInfoFromUser]);

    return (
        <div className="col-1 rounded burder-menu">
            <Nav primaryColor={primaryColor}>
                <div className="burder-menu-logo">
                    <NavLink to="/">
                        <img src={headerLogo} alt="logo_rair" />
                    </NavLink>
                </div>
                {openProfile ? <List primaryColor={primaryColor} click={click}>
                    <ListProfileItem>
                        <ProfileButtonBack onClick={toggleOpenProfile}><i className="fas fa-chevron-left"></i></ProfileButtonBack>
                        {userData && <div className="burger-menu-profile">
                            {userData.avatar && <div><img className="burger-menu-avatar" src={userData.avatar} alt="avatar" /></div>}
                            <div style={{margin: "10px 0"}}>Name: {userData.nickName && userData.nickName.substr(0, 20) + "..."}</div>
                            <div>Email: {userData.email}</div>
                        </div>}
                    </ListProfileItem>
                </List> : <List primaryColor={primaryColor} click={click}>
                    {!loginDone && !renderBtnConnect && <ListItem primaryColor={primaryColor}>
                        <div className='btn-connect-wallet-wrapper'>
                            <button disabled={!window.ethereum && !programmaticProvider && !startedLogin}
                                className={`btn btn-${primaryColor} btn-connect-wallet`}
                                onClick={connectUserData}>
                                {startedLogin ? 'Please wait...' : 'Connect Wallet'}
                            </button>
                        </div>
                    </ListItem>}
                    {
                        renderBtnConnect && <ListItem>
                            <OnboardingButton className="borading-btn-mobile" />
                        </ListItem>
                    }
                    {
                        loginDone && <ListItem primaryColor={primaryColor}>
                            <div className="burder-menu-profile" onClick={toggleOpenProfile}>
                                <i className="fas fa-cog"></i>Profile settings
                            </div>
                        </ListItem>
                    }
                    <ListItem primaryColor={primaryColor}>
                        <a
                            href="https://rair.tech/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            RAIR TECH
                        </a>
                    </ListItem>
                    <ListItem primaryColor={primaryColor}>
                        <button
                            className="btn-change-theme"
                            style={{
                                backgroundColor:
                                    primaryColor === "charcoal" ? "#222021" : "#D3D2D3",
                                borderRadius: "12px",
                                width: 32,
                                height: 32,
                                fontSize: 18,
                            }}
                            onClick={(e) => {
                                dispatch({
                                    type: colorTypes.SET_COLOR_SCHEME,
                                    payload: primaryColor === "rhyno" ? "charcoal" : "rhyno",
                                });
                            }}
                        >
                            {primaryColor === "rhyno" ? (
                                <i className="far fa-moon" />
                            ) : (
                                <i className="fas fa-sun" />
                            )}
                        </button>
                    </ListItem>
                    {loginDone && <ListItem primaryColor={primaryColor} onClick={logout}>
                        <div className="burger-menu-logout">
                            <i className="fas fa-sign-out-alt"></i>Logout
                        </div>
                    </ListItem>}
                </List>}
                {click ? <div className="mobile-menu" onClick={toggleMenu}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </div> : <div className="mobile-menu" onClick={() => { toggleMenu(); setOpenProfile(false) }}>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </div>}
            </Nav>
        </div>
    )
}

export default MenuNavigation
