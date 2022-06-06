// @ts-nocheck
import React, { useState, useCallback, useEffect, Suspense } from 'react'
import "./Menu.css";
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from './NavigationItems/NavigationItems';
import { NavLink } from 'react-router-dom';
import MobileProfileInfo from './MenuComponents/MobileProfileInfo';
import MobileListMenu from './MenuComponents/MobileListMenu';
import { getTokenComplete } from '../../ducks/auth/actions';
import { setUserAddress } from '../../ducks/contracts';
import axios from 'axios';
import { TUserResponse } from '../../axios.responseTypes';

const MenuNavigation = ({
    headerLogo,
    connectUserData,
    startedLogin,
    renderBtnConnect,
    loginDone,
    setLoginDone,
    currentUserAddress,
    adminRights,
    creatorViewsDisabled
}) => {
    const [click, setClick] = useState(false);
    const [userData, setUserData] = useState(null)
    const [openProfile, setOpenProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { primaryColor } = useSelector(store => store.colorStore);

    const toggleMenu = () => {
        setClick(prev => !prev);
    }

    const toggleOpenProfile = useCallback(() => {
        setOpenProfile(prev => !prev);
    }, [setOpenProfile])

    const logout = () => {
        dispatch(getTokenComplete(null));
        dispatch(setUserAddress(undefined));
        localStorage.removeItem("token");
        setLoginDone(false);
        toggleMenu();
    };

    const getInfoFromUser = useCallback(async () => {
        // find user
        if (currentUserAddress) {
            const result = await axios.get<TUserResponse>(`/api/users/${currentUserAddress}`).then(
                (res) => {
                    setUserData(null);
                    setLoading(true);
                    return res.data;
                }
            );
            if (result.success) {
                setLoading(false);
                setUserData(result.user);
            }
        }
    }, [currentUserAddress, setUserData, setLoading]);

    const onScrollClick = useCallback(() => {
        if (!click) {
            document.body.style.overflow = 'unset';
        }
    }, [click])

    useEffect(() => {
        onScrollClick()
    }, [onScrollClick])

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
                {openProfile ? <Suspense fallback={<h1>Loading profile...</h1>}>
                    <MobileProfileInfo
                        setUserData={setUserData}
                        primaryColor={primaryColor}
                        click={click}
                        toggleOpenProfile={toggleOpenProfile}
                        userData={userData}
                        currentUserAddress={currentUserAddress}
                        loading={loading}
                    />
                </Suspense> : <MobileListMenu
                    creatorViewsDisabled={creatorViewsDisabled}
                    adminRights={adminRights}
                    primaryColor={primaryColor}
                    click={click}
                    renderBtnConnect={renderBtnConnect}
                    loginDone={loginDone}
                    startedLogin={startedLogin}
                    connectUserData={connectUserData}
                    toggleMenu={toggleMenu}
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
