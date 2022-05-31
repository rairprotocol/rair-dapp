//@ts-nocheck
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { OnboardingButton } from './../common/OnboardingButton';
import UserProfileSettings from './../UserProfileSettings/UserProfileSettings';
import MainLogo from '../GroupLogos/MainLogo';
import DiscordIcon from './DiscordIcon';

//images
import headerLogoWhite from './../../images/rairTechLogoWhite.png';
import headerLogoBlack from './../../images/rairTechLogoBlack.png';

//styles
import "./Header.css";
import { NavLink } from 'react-router-dom';
import Popup from 'reactjs-popup';

const MainHeader = ({ goHome, loginDone, startedLogin, renderBtnConnect, connectUserData, setLoginDone, userData, errorAuth, sentryHistory, creatorViewsDisabled, selectedChain, showAlert
}) => {
    const { primaryColor, headerLogo } = useSelector(store => store.colorStore);
    const { adminRights } = useSelector(store => store.userStore);
    const {
        currentUserAddress,
        programmaticProvider,
        minterInstance,
        diamondMarketplaceInstance,
        factoryInstance
    } = useSelector(store => store.contractStore);

    const [textSearch, setTextSearch] = useState('');
    const [adminPanel, setAdminPanel] = useState(false);


    const handleChangeText = (e) => {
        setTextSearch(e.target.value);
    }

    const handleClearText = () => {
        setTextSearch('');
    }

    return (
        <div className="col-12 header-master"
            style={{
                background: `${primaryColor === "rhyno" ? "#C4C4C4" : "#383637"}`,
                marginTop: `${showAlert && selectedChain ? "50px" : ""}`
            }}>
            <div>
                <MainLogo
                    goHome={goHome}
                    sentryHistory={sentryHistory}
                    headerLogoWhite={headerLogoWhite}
                    headerLogoBlack={headerLogoBlack}
                    headerLogo={headerLogo}
                    primaryColor={primaryColor}
                />
            </div>
            <div className="main-search">
                <input
                    className={primaryColor === "rhyno" ? "" : "input-search-black"}
                    type="text"
                    placeholder='Search the rairverse...'
                    onChange={handleChangeText}
                    value={textSearch}
                />
                {
                    textSearch && textSearch.length > 0 && <i
                        onClick={handleClearText}
                        className="fas fa-times"
                        aria-hidden="true"
                    ></i>
                }
                <i
                    className="fas fa-search"
                    aria-hidden="true"
                ></i>
            </div>
            <div className="box-header-info">
                {
                    !loginDone &&
                    <div>
                        {renderBtnConnect ?
                            <OnboardingButton />
                            :
                            <button
                                disabled={!window.ethereum && !programmaticProvider && !startedLogin}
                                className={`btn btn-${primaryColor} btn-connect-wallet`}
                                onClick={connectUserData}>
                                {startedLogin ? 'Please wait...' : 'Connect'}
                                {/* <img alt='Metamask Logo' src={MetamaskLogo}/> */}
                            </button>
                        }
                    </div>
                }
                <div
                    className="box-connect-btn">
                        {
                            adminRights && <div onClick={() => setAdminPanel(prev => !prev)} className="admin-panel-btn">
                                <i className="fa fa-user-secret" aria-hidden="true" />
                            </div>
                        }
                    <UserProfileSettings
                        userData={userData}
                        errorAuth={errorAuth}
                        adminAccess={adminRights}
                        primaryColor={primaryColor}
                        currentUserAddress={currentUserAddress}
                        loginDone={loginDone}
                        setLoginDone={setLoginDone}
                    />
                    <div className="social-media">
                        <div className="box-social"
                            style={{
                                border: `1px solid ${primaryColor === "rhyno" ? "#9867D9" : "#fff"}`,
                                background: `${primaryColor === "rhyno" ? "#b2b2b2" : ""}`
                            }}
                        >
                            <a
                                href="https://twitter.com/rairtech"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                        <div className="box-social"
                            style={{
                                border: `1px solid ${primaryColor === "rhyno" ? "#9867D9" : "#fff"}`,
                                background: `${primaryColor === "rhyno" ? "#b2b2b2" : ""}`
                            }}
                        >
                            <a
                                href="https://discord.gg/pSTbf2yz7V"
                                target={"_blank"}
                                rel="noreferrer"
                            >
                                <DiscordIcon width="71px" height="55px" color={primaryColor === "rhyno" ? "#9867D9" : "#fff"} />
                            </a>
                        </div>
                        <Popup
                            className="popup-admin-panel"
                            open={adminPanel}
                            closeOnDocumentClick
                            onClose={() => setAdminPanel(false)}
                        >
                            <div className="container-admin-panel">
                                {
                                    adminPanel && adminRights === true && !creatorViewsDisabled && [
                                        { name: <i className="fas fa-photo-video" />, route: '/all', disabled: !loginDone },
                                        { name: <i className="fas fa-key" />, route: '/my-nft' },
                                        { name: <i className="fa fa-id-card" aria-hidden="true" />, route: '/new-factory', disabled: !loginDone },
                                        { name: <i className="fa fa-shopping-cart" aria-hidden="true" />, route: '/on-sale', disabled: !loginDone },
                                        { name: <i className="fa fa-user-secret" aria-hidden="true" />, route: '/admin', disabled: !loginDone },
                                        { name: <i className="fas fa-city" />, route: '/factory', disabled: factoryInstance === undefined },
                                        { name: <i className="fas fa-shopping-basket" />, route: '/minter', disabled: minterInstance === undefined },
                                        { name: <i className="fas fa-gem" />, route: '/diamondMinter', disabled: diamondMarketplaceInstance === undefined },
                                        { name: <i className="fas fa-exchange" />, route: '/admin/transferNFTs', disabled: !loginDone },
                                        { name: <i className="fas fa-file-import" />, route: '/importExternalContracts', disabled: !loginDone }
                                    ].map((item, index) => {
                                        if (!item.disabled) {
                                            return <div key={index} className={`col-12 py-3 btn-${primaryColor}`}>
                                                <NavLink activeClassName={`active-${primaryColor}`} className='py-3' to={item.route} style={{ color: 'inherit', textDecoration: 'none' }}
                                                onClick={() => {setAdminPanel(false)}}
                                                >
                                                    {item.name}
                                                </NavLink>
                                            </div>
                                        }
                                        return <div key={index}></div>
                                    })
                                }
                            </div>
                        </Popup>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader