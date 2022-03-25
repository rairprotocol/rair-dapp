import React, { useState } from 'react'
import "./Menu.css";
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import * as colorTypes from "../../ducks/colors/types";
import * as authTypes from "../../ducks/auth/types";
import * as contractTypes from "../../ducks/contracts/types";

const Nav = styled.nav`
  background: ${(props) => props.primaryColor === "rhyno" ? "rgb(192, 192, 192)" : "rgb(43, 40, 41)"};
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  z-index: 12;
`;

const ListItem = styled.li`
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10vw;
    padding: 30px 0px;
    width: 100%;
    &:hover {
        background: ${props => props.primaryColor === "rhyno" ? "rgb(211, 210, 211)" : "rgb(46, 44, 45)"};
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

const List = styled.ul`
        background: ${props => props.primaryColor === "rhyno" ? "rgb(201, 201, 201)" : "rgb(56, 54, 55)"};
        overflow: ${(props) => props.click && "hidden"};
        border-bottom-right-radius:  ${(props) => props.click ? "16px" : ""};
        border-bottom-left-radius: ${(props) => props.click ? "16px" : ""};
        margin-top: 5px;
        display: flex;
        width: 100%;
        position: absolute;
        top: 80px;
        left: ${(props) => props.click ? "0" : "-100%"};
        opacity: ${(props) => props.click ? "1" : "0"};
        align-items: ${props => props.click && "center"};
        padding-left: ${props => props.click && "0px"};
        transition: all 0.5s ease;
        flex-direction: column;
        list-style-type: none;
        grid-gap: 0px;
        z-index: 1;
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
                <List primaryColor={primaryColor} click={click}>
                    {!loginDone && !renderBtnConnect && <ListItem primaryColor={primaryColor}>
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
                <ul className={click ? "nav-options active" : "nav-options"}>

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