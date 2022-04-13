import React, { useState, useCallback, useEffect, Suspense } from 'react'
import "./Menu.css";
import { useDispatch, useSelector } from 'react-redux';
import * as authTypes from "../../ducks/auth/types";
import * as contractTypes from "../../ducks/contracts/types";
import { Nav } from './NavigationItems/NavigationItems';
import { NavLink } from 'react-router-dom';
import MobileProfileInfo from './MenuComponents/MobileProfileInfo';
import MobileListMenu from './MenuComponents/MobileListMenu';

const MenuNavigation = ({
    headerLogo,
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
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { primaryColor } = useSelector(store => store.colorStore);

    const toggleMenu = () => {
        setClick(prev => !prev);
        setEditMode(false)
    }

    const toggleEditMode = useCallback(() => {
        setEditMode(prev => !prev);
    }, [setEditMode])

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
        if (currentUserAddress) {
            const result = await fetch(`/api/users/${currentUserAddress}`).then(
                (blob) => {
                    setUserData(null);
                    setLoading(true);
                    return blob.json();
                }
            );

            if (result.success) {
                setLoading(false);
                setUserData(result.user);
            }
        }
    }, [currentUserAddress, editMode]);

    useEffect(() => {
        getInfoFromUser();
    }, [getInfoFromUser]);

    useEffect(() => {
        if (editMode) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
    }, [editMode])

    return (
        <div className="col-1 rounded burder-menu">
            <Nav primaryColor={primaryColor} editMode={editMode}>
                <div className="burder-menu-logo">
                    <NavLink to="/">
                        <img src={headerLogo} alt="logo_rair" />
                    </NavLink>
                </div>
                {openProfile ? <Suspense fallback={<h1>Loading profile...</h1>}>
                    <MobileProfileInfo
                        primaryColor={primaryColor}
                        click={click}
                        toggleOpenProfile={toggleOpenProfile}
                        userData={userData}
                        toggleEditMode={toggleEditMode}
                        editMode={editMode}
                        currentUserAddress={currentUserAddress}
                        loading={loading}
                    />
                </Suspense> : <MobileListMenu
                    primaryColor={primaryColor}
                    click={click}
                    renderBtnConnect={renderBtnConnect}
                    loginDone={loginDone}
                    startedLogin={startedLogin}
                    programmaticProvider={programmaticProvider}
                    connectUserData={connectUserData}
                    toggleOpenProfile={toggleOpenProfile}
                    logout={logout}
                />}
                {click ? <div className="mobile-menu" onClick={toggleMenu}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </div> : <div className="mobile-menu" onClick={() => { toggleMenu(); setOpenProfile(false); }}>
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </div>}
            </Nav>
        </div>
    )
}

export default MenuNavigation
