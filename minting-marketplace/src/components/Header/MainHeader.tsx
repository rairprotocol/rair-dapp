//@ts-nocheck
import React, { useState } from 'react';
import { OnboardingButton } from './../common/OnboardingButton';
import UserProfileSettings from './../UserProfileSettings/UserProfileSettings';
import MainLogo from '../GroupLogos/MainLogo';
import DiscordIcon from './DiscordIcon';
import "./Header.css";

const MainHeader = ({ goHome, headerLogo, loginDone, startedLogin, renderBtnConnect, connectUserData, primaryColor, setLoginDone, userData, errorAuth, adminRights, currentUserAddress, sentryHistory, headerLogoWhite, headerLogoBlack, programmaticProvider
}) => {
    const [textSearch, setTextSearch] = useState('');

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

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader