import React, { useState } from 'react'
import "./Menu.css";
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import * as colorTypes from "../../ducks/colors/types";
import * as authTypes from "../../ducks/auth/types";
import * as contractTypes from "../../ducks/contracts/types";

const Nav = styled.nav`
  background: ${(props) => props.primaryColor === "rhyno" ? "white" : "rgb(43, 40, 41)"};
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  z-index: 12;
`;

const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10vw;
    padding: 30px 0px;
    &:hover {
        background:rgb(46, 44, 45)
    }

    .burger-menu-logout {
        width: 100%;
        cursor: pointer;
        i {
            margin-right: 10px;
        }
    }

    a {
        width: 100%;
    }
`;

const MenuNavigation = ({
    headerLogo,
    primaryColor,
    connectUserData,
    startedLogin,
    programmaticProvider,
    renderBtnConnect,
    loginDone,
    setLoginDone
}) => {
    const [click, setClick] = useState(false);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setClick(prev => !prev);
    }

    const logout = () => {
        dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: null });
        dispatch({ type: contractTypes.SET_USER_ADDRESS, payload: undefined });
        localStorage.removeItem("token");
        setLoginDone(false);
        toggleMenu();
    };

    return (
        <div className="col-1 rounded burder-menu">
            <Nav primaryColor={primaryColor}>
                <div>
                    <img style={{ width: "50px", height: "auto" }} src={headerLogo} alt="" />
                </div>
                <ul className={click ? "nav-options active" : "nav-options"}>
                    {!loginDone && !renderBtnConnect && <ListItem>
                        <div className='btn-connect-wallet-wrapper'>
                            <button disabled={!window.ethereum && !programmaticProvider && !startedLogin}
                                className={`btn btn-${primaryColor} btn-connect-wallet`}
                                onClick={connectUserData}>
                                {startedLogin ? 'Please wait...' : 'Connect Wallet'}
                                {/* <img alt='Metamask Logo' src={MetamaskLogo}/> */}
                            </button>
                            {/* {renderBtnConnect ?
                                <OnboardingButton />
                                :
                                <></>
                            } */}
                        </div>
                    </ListItem>}
                    <ListItem>
                        <a
                            href="https://rair.tech/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            RAIR TECH
                        </a>
                    </ListItem>
                    <ListItem>
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
                    {loginDone && <ListItem onClick={logout}>
                        <div className="burger-menu-logout">
                            <i className="fas fa-sign-out-alt"></i>Logout
                        </div>
                    </ListItem>}
                </ul>
                <div className="mobile-menu" onClick={toggleMenu}>
                    {click ? (
                        <i className="fa fa-times" aria-hidden="true"></i>
                    ) : (
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    )}
                </div>
            </Nav>
        </div>
    )
}

export default MenuNavigation