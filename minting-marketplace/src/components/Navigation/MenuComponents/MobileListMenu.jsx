import React from 'react';
import * as colorTypes from "./../../../ducks/colors/types";
import { OnboardingButton } from './../../common/OnboardingButton';
import { useDispatch } from 'react-redux';
import { List, ListItem } from './../NavigationItems/NavigationItems';

const MobileListMenu = ({
    primaryColor,
    click,
    renderBtnConnect,
    loginDone,
    startedLogin,
    programmaticProvider,
    connectUserData,
    toggleOpenProfile,
    logout
}) => {
    const dispatch = useDispatch();

    return (
        <List primaryColor={primaryColor} click={click}>
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
        </List>
    )
}

export default MobileListMenu