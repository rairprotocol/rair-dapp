//@ts-nocheck

//tools
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import axios from 'axios';

//imports components
import UserProfileSettings from './../UserProfileSettings/UserProfileSettings';
import ImageCustomForSearch from '../MockUpPage/utils/image/ImageCustomForSearch';
import { OnboardingButton } from './../common/OnboardingButton';
import MainLogo from '../GroupLogos/MainLogo';
import DiscordIcon from './DiscordIcon';
import AdminPanel from './AdminPanel/AdminPanel';

//images
import headerLogoWhite from './../../images/rairTechLogoWhite.png';
import headerLogoBlack from './../../images/rairTechLogoBlack.png';

//styles
import "./Header.css";

const MainHeader = ({
    goHome,
    loginDone,
    startedLogin,
    renderBtnConnect,
    connectUserData,
    setLoginDone,
    userData,
    errorAuth,
    sentryHistory,
    creatorViewsDisabled,
    selectedChain,
    showAlert
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { primaryColor, headerLogo } = useSelector(store => store.colorStore);
    const { dataAll, message } = useSelector((store) => store.allInformationFromSearch);
    const { adminRights } = useSelector(store => store.userStore);
    const {
        currentUserAddress,
        programmaticProvider,
    } = useSelector(store => store.contractStore);
    const [hiddenHeader, setHiddenHeader] = useState(false);
    const [textSearch, setTextSearch] = useState('');
    const [adminPanel, setAdminPanel] = useState(false);

    const splashPages = [
        '/immersiverse-splash',
        '/video-tiles-test',
        '/nftla-splash',
        '/ukraineglitch',
        '/vaporverse-splash',
        '/greyman-splash',
        '/nutcrackers-splash',
        '/nipsey-splash',
        '/about-page',
        '/slidelock'
    ];

    const handleHiddinHeader = (param) => {
        setHiddenHeader(false);
        for (const el of splashPages) {
            if (param === el) {
                setHiddenHeader(true);
            }
        }
    }

    const goToExactlyContract = useCallback(async (addressId: String, collectionIndexInContract: String) => {
        if (dataAll) {
            const response = await axios.get(`/api/contracts/singleContract/${addressId}`);
            const exactlyContractData = {
                blockchain: response.data.contract.blockchain,
                contractAddress: response.data.contract.contractAddress,
                indexInContract: collectionIndexInContract,
            };
            history.push(
                `/collection/${exactlyContractData.blockchain}/${exactlyContractData.contractAddress}/${exactlyContractData.indexInContract}/0`
            )
            setTextSearch('');
            dispatch({ type: "GET_DATA_ALL_CLEAR" });
        }
    }, [dataAll, dispatch, history]);

    const goToExactlyToken = useCallback(async (addressId: String, token: String) => {
        if (dataAll) {
            const response = await axios.get(`/api/contracts/singleContract/${addressId}`);
            const exactlyTokenData = {
                blockchain: response.data.contract.blockchain,
                contractAddress: response.data.contract.contractAddress,
            };
            history.push(
                `/tokens/${exactlyTokenData.blockchain}/${exactlyTokenData.contractAddress}/0/${token}`
            )
            setTextSearch('');
            dispatch({ type: "GET_DATA_ALL_CLEAR" });
        }
    }, [dataAll, dispatch, history]);

    const Highlight = (props) => {
        const { filter, str } = props
        if (!filter) return str
        const regexp = new RegExp(filter, 'ig')
        const matchValue = str.match(regexp)
        if (matchValue) {
            return str.split(regexp).map((s, index, array) => {
                if (index < array.length - 1) {
                    const c = matchValue.shift()
                    return <React.Fragment key={index}>{s}<span className={'highlight'}>{c}</span></React.Fragment>
                }
                return s
            })
        }
        return str
    }

    const handleChangeText = (e) => {
        setTextSearch(e.target.value);
    }

    const handleClearText = () => {
        setTextSearch('');
    }

    useEffect(() => {
        if (textSearch.length > 0) {
            dispatch({ type: "GET_DATA_ALL_START", payload: textSearch });
        }
    }, [dispatch, textSearch]);

    useEffect(() => {
        handleHiddinHeader(sentryHistory.location.pathname)
    }, [sentryHistory.location.pathname])

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
            <div className={`main-search ${hiddenHeader ? "hidden" : ""}`}>
                <input
                    className={primaryColor === "rhyno" ? "" : "input-search-black"}
                    type="text"
                    placeholder='Search the rairverse...'
                    onChange={handleChangeText}
                    value={textSearch}
                />
                <div className={`search-holder-wrapper ${primaryColor === 'rhyno' ? 'rhyno' : ''}`}>
                    <div className='search-holder'>
                        {textSearch &&
                            <>
                                {
                                    dataAll?.products.length > 0 ?
                                        <div className="data-find-wrapper">
                                            <h5>Products</h5>
                                            {dataAll?.products.map((item: Object, index: Number) =>
                                                <div key={index + Math.random()} className="data-find">
                                                    <img className="data-find-img" src={item.cover} alt={item.name} />
                                                    <p onClick={() => goToExactlyContract(item.contract, item.collectionIndexInContract)}>
                                                        <Highlight filter={textSearch} str={item.name} />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        : <></>
                                }
                                {
                                    dataAll?.tokens.length > 0 ?
                                        <div className="data-find-wrapper">
                                            <h5>Tokens</h5>
                                            {dataAll?.tokens.map((item: Object, index: Number) =>
                                                <div key={index + Math.random()} className="data-find">
                                                    <ImageCustomForSearch item={item} />
                                                    <p onClick={() => goToExactlyToken(item.contract, item.uniqueIndexInContract)}>
                                                        <Highlight filter={textSearch} str={item.metadata.name} />
                                                    </p>
                                                    <div className="desc-wrapper">
                                                        <p>
                                                            <Highlight filter={textSearch} str={item.metadata.description} />
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        : <></>
                                }
                                {
                                    dataAll?.users.length > 0 ?
                                        <div className="data-find-wrapper">
                                            <h5>Users</h5>
                                            {dataAll?.users.map((item: Object, index: Number) =>
                                                <div key={index + Math.random()} className="data-find">
                                                    <img className="data-find-img" src={item.avatar} alt={item.nickName} />
                                                    <p>
                                                        <Highlight filter={textSearch} str={item.nickName} />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        : <></>
                                }
                            </>
                        } {textSearch !== '' && message === 'Nothing' ? <span className='data-nothing-find'>No items found</span> : <></>}
                    </div>
                </div>
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
                        <AdminPanel
                            loginDone={loginDone}
                            creatorViewsDisabled={creatorViewsDisabled}
                            adminPanel={adminPanel}
                            setAdminPanel={setAdminPanel}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainHeader
