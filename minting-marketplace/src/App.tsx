//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJWT, isTokenValid } from './utils/rFetch';
import { detectBlockchain } from './utils/blockchainData';
import { setAdminRights } from './ducks/users/actions';
import { getCurrentPageEnd } from './ducks/pages/actions';
import { getTokenComplete, getTokenStart } from './ducks/auth/actions';
import { setChainId, setUserAddress } from './ducks/contracts/actions';
import { OnboardingButton } from './components/common/OnboardingButton/OnboardingButton';
import axios from 'axios';
import { TUserResponse } from './axios.responseTypes';

import './App.css';

// React Redux types
import { withSentryReactRouterV6Routing, ErrorBoundary } from '@sentry/react';
// import * as ethers from 'ethers';
// import * as colorTypes from './ducks/colors/types';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import gtag from './utils/gtag';

import jsonwebtoken from 'jsonwebtoken';

//import CSVParser from './components/metadata/csvParser';
import AboutPageNew from './components/AboutPage/AboutPageNew/AboutPageNew';

import ComingSoon from './components/SplashPage/CommingSoon/CommingSoon';
import ComingSoonNut from './components/SplashPage/CommingSoon/ComingSoonNut';
import ConsumerMode from './components/consumerMode';
import Contracts from './components/creatorStudio/Contracts';
import ContractDetails from './components/creatorStudio/ContractDetails';
import CreatorMode from './components/creatorMode';

import Deploy from './components/creatorStudio/Deploy';
import DiamondMarketplace from './components/ConsumerMode/DiamondMarketplace';

import Footer from './components/Footer/Footer';
import FileUpload from './components/video/videoUpload/videoUpload';

import GreymanSplashPage from './components/SplashPage/GreymanSplashPage';

import ImportExternalContracts from './components/adminViews/ImportExternalContracts';
import ImmersiVerseSplashPage from './components/SplashPage/ImmersiVerseSplashPage';

import ListCollections from './components/creatorStudio/ListCollections';

import MyContracts from './components/whitelabel/myContracts';
import MinterMarketplace from './components/marketplace/MinterMarketplace';
import MockUpPage from './components/MockUpPage/MockUpPage';
import MyItems from './components/nft/myItems';

import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import { NftDataCommonLink } from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
import NftDataExternalLink from './components/MockUpPage/NftList/NftData/NftDataExternalLink';
import NotFound from './components/NotFound/NotFound';
import Nutcrackers from './components/SplashPage/Nutcrackers/Nutcrackers';

import { PrivacyPolicy } from './components/SplashPage/PrivacyPolicy';

import RairProduct from './components/nft/rairCollection';

import SplashPage from './components/SplashPage';
// import setTitle from './utils/setTitle';

import ThankYouPage from './components/ThankYouPage';
import Token from './components/nft/Token';
import TransferTokens from './components/adminViews/transferTokens';
import { TermsUse } from './components/SplashPage/TermsUse';

import WorkflowSteps from './components/creatorStudio/workflowSteps';

// logos for About Page
import headerLogoWhite from './images/rairTechLogoWhite.png';
import headerLogoBlack from './images/rairTechLogoBlack.png';
import RairFavicon from './components/MockUpPage/assets/rair_favicon.ico';
import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import AlertMetamask from './components/AlertMetamask/index';
import NFTLASplashPage from './components/SplashPage/NFTLASplashPage';
import MenuNavigation from './components/Navigation/Menu';
import UkraineSplashPage from './components/SplashPage/UkraineGlitchSplashPage/UkraineSplashPage';
import NFTNYCSplashPage from './components/SplashPage/NFTNYC/NFTNYC';
import RAIRGenesisSplashPage from './components/SplashPage/RAIRGenesis/RAIRGenesis';
import SimDogsSplashPage from './components/SplashPage/SimDogs/SimDogs';
import VaporverseSplashPage from './components/SplashPage/VaporverseSplash/VaporverseSplashPage';
import WelcomeHeader from './components/FrontPage/WelcomeHeader';
import MainHeader from './components/Header/MainHeader';
import SlideLock from './components/SplashPage/SlideLock/SlideLock';
import VideoTilesTest from './components/SplashPage/SplashPageTemplate/VideoTiles/VideosTilesTest';
import {
  AppContainerFluid,
  MainBlockApp
} from './styled-components/nft/AppContainer';
import CoinAgenda2021SplashPage from './components/SplashPage/CoinAgenda2021/CoinAgenda2021';
import InquiriesPage from './components/InquiriesPage/InquiriesPage';
import Wallstreet80sClubSplashPage from './components/SplashPage/wallstreet80sclub/wallstreet80sclub';
import IframePage from './components/iframePage/IframePage';
import TestIframe from './components/iframePage/testIframe';

const rSwal = withReactContent(Swal);

//Google Analytics
// import ReactGA from 'react-ga';

const gAppName = process.env.REACT_APP_GA_NAME;
const gUaNumber = process.env.REACT_APP_GOOGLE_ANALYTICS;
const analytics = Analytics({
  app: gAppName,
  plugins: [
    googleAnalytics({
      trackingId: gUaNumber
    })
  ]
});
/* Track a page view */
analytics.page();

const ErrorFallback = () => {
  return (
    <div className="not-found-page">
      <h3>
        <span className="text-404">Sorry!</span>
      </h3>
      <p>An error has ocurred</p>
    </div>
  );
};

const SentryRoutes = withSentryReactRouterV6Routing(Routes);

function App() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [startedLogin, setStartedLogin] = useState(false);
  const [loginDone, setLoginDone] = useState(false);
  const [renderBtnConnect, setRenderBtnConnect] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isSplashPage, setIsSplashPage] = useState(false);
  const [isIframePage, setIsIframePage] = useState<boolean>(false);
  const { currentChain, realChain } = useSelector(
    (store) => store.contractStore
  );
  const { selectedChain, realNameChain, selectedChainId } = detectBlockchain(
    currentChain,
    realChain
  );
  const carousel_match = window.matchMedia('(min-width: 1025px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const seoInformation = {
    title: 'RAIR Technologies',
    contentName: 'author',
    content: 'Digital Ownership Encryption',
    description:
      'RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
    favicon: RairFavicon,
    faviconMobile: RairFavicon
  };

  // Redux
  const {
    currentUserAddress,
    minterInstance,
    factoryInstance,
    programmaticProvider,
    diamondMarketplaceInstance
  } = useSelector((store) => store.contractStore);
  const { primaryColor, textColor, backgroundImage, backgroundImageEffect } =
    useSelector((store) => store.colorStore);
  const { token } = useSelector((store) => store.accessStore);
  const { adminRights } = useSelector((store) => store.userStore);

  const connectUserData = useCallback(async () => {
    setStartedLogin(true);
    let currentUser;
    const dispatchStack = [];
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      dispatchStack.push(setUserAddress(accounts[0]));
      dispatchStack.push(setChainId(window.ethereum.chainId?.toLowerCase()));
      currentUser = accounts[0];
    } else if (programmaticProvider) {
      dispatchStack.push(setUserAddress(programmaticProvider.address));
      dispatchStack.push(
        setChainId(
          `0x${programmaticProvider.provider._network.chainId
            ?.toString(16)
            ?.toLowerCase()}`
        )
      );
      currentUser = programmaticProvider.address;
    } else {
      rSwal.fire({
        title: 'Please install a Crypto wallet',
        html: (
          <div>
            <OnboardingButton />
          </div>
        ),
        icon: 'error'
      });
      setStartedLogin(false);
      return;
    }

    if (!currentUser && currentUser !== undefined) {
      Swal.fire('Error', 'No user address found', 'error');
      setStartedLogin(false);
      return;
    }

    try {
      // Check if user exists in DB
      const userData = await axios.get<TUserResponse>(
        `/api/users/${currentUser}`
      );
      const { success, user } = userData.data;
      if (!success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        console.info('Address is not registered!');
        const userCreation = await axios.post<TUserResponse>(
          '/api/users',
          JSON.stringify({ publicAddress: currentUser }),
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        const { user } = userCreation.data;
        setUserData(user);
      } else {
        setUserData(user);
      }

      // Authorize user and get JWT token
      if (
        adminRights === null ||
        adminRights === undefined ||
        !localStorage.token ||
        !isTokenValid(localStorage.token)
      ) {
        dispatchStack.push(getTokenStart());
        const token = await getJWT(programmaticProvider, currentUser);

        if (!success) {
          setStartedLogin(false);
          setLoginDone(false);
          dispatchStack.push(setAdminRights(false));
          dispatchStack.push(getTokenComplete(token));
          localStorage.setItem('token', token);
        } else {
          const decoded = jsonwebtoken.decode(token);
          dispatchStack.push(setAdminRights(decoded.adminRights));
          dispatchStack.push(getTokenComplete(token));
          localStorage.setItem('token', token);
        }
      }

      setStartedLogin(false);
      dispatchStack.forEach((dispatchItem) => {
        dispatch(dispatchItem);
      });
      setLoginDone(true);
    } catch (err) {
      console.error('Error', err);
      setStartedLogin(false);
    }
  }, [programmaticProvider, adminRights, dispatch]);

  const goHome = () => {
    navigate('/');
    setShowAlert(false);
    dispatch(getCurrentPageEnd());
  };

  const btnCheck = useCallback(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setRenderBtnConnect(false);
    } else {
      setRenderBtnConnect(true);
    }
  }, [setRenderBtnConnect]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async (chainId) => {
        dispatch(setChainId(chainId));
      });
    }
  }, [dispatch]);

  // gtag

  useEffect(() => {
    gtag('event', 'page_view', {
      page_title: window.location.pathname,
      page_location: window.location.href
    });
  }, []);

  useEffect(() => {
    // setTitle('Welcome');
    if (process.env.NODE_ENV === 'development') {
      window.gotoRouteBackdoor = navigate;
      window.adminAccessBackdoor = (boolean) => {
        dispatch(setAdminRights(boolean));
      };
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    btnCheck();
  }, [btnCheck]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  // const checkToken = useCallback(() => {
  //  btnCheck()
  //  const token = localStorage.getItem('token');
  //  if (!isTokenValid(token)) {
  //    connectUserData()
  //    dispatch({ type: authTypes.GET_TOKEN_START });
  //    dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token })
  //  }
  // }, [ connectUserData, dispatch ])

  useEffect(() => {
    let timeout;
    if (token) {
      const decoded = jsonwebtoken.decode(token);

      if (decoded?.exp) {
        timeout = setTimeout(() => {
          connectUserData();
        }, decoded.exp * 1000);
      }
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [token, connectUserData]);

  useEffect(() => {
    if (localStorage.token && isTokenValid(localStorage.token)) {
      if (window.ethereum) {
        connectUserData();
        dispatch(getTokenStart());
        dispatch(getTokenComplete(token));
      } else {
        // If the token exists but Metamask is not enabled, delete the JWT so the user has to sign in again
        localStorage.removeItem('token');
      }
    }
  }, [connectUserData, dispatch, token]);

  // useEffect(() => {
  //  checkToken();
  // }, [checkToken, token])

  useEffect(() => {
    if (primaryColor === 'charcoal') {
      (function () {
        let angle = 0;
        const p = document.querySelector('p');
        if (p) {
          const text = p.textContent.split('');
          /* eslint-disable  */
          var len = text.length;
          var phaseJump = 360 / len;
          var spans;
          /* eslint-enable  */
          p.innerHTML = text
            .map(function (char) {
              return '<span>' + char + '</span>';
            })
            .join('');

          spans = p.children;
        } else console.info('kik');

        // function wheee() {
        //   for (var i = 0; i < len; i++) {
        //     spans[i].style.color =
        //       "hsl(" + (angle + Math.floor(i * phaseJump)) + ", 55%, 70%)";
        //   }
        //   angle+=5;
        // //   requestAnimationFrame(wheee);
        // };
        // setInterval(wheee, 100);

        (function wheee() {
          for (let i = 0; i < len; i++) {
            spans[i].style.color =
              'hsl(' + (angle + Math.floor(i * phaseJump)) + ', 55%, 70%)';
          }
          angle++;
          requestAnimationFrame(wheee);
        })();
      })();
    }
  }, [primaryColor]);

  useEffect(() => {
    if (!selectedChain) return;

    if (!showAlert) {
      setShowAlert(true);
    }
    //eslint-disable-next-line
  }, [selectedChain]);

  const creatorViewsDisabled =
    process.env.REACT_APP_DISABLE_CREATOR_VIEWS === 'true';

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {selectedChain && showAlert && !isSplashPage ? (
        <AlertMetamask
          selectedChain={selectedChain}
          selectedChainId={selectedChainId}
          realNameChain={realNameChain}
          setShowAlert={setShowAlert}
        />
      ) : null}
      <AppContainerFluid
        className="App p-0 container-fluid"
        backgroundImageEffect={backgroundImageEffect}
        textColor={textColor}
        primaryColor={primaryColor}
        backgroundImage={backgroundImage}
        showAlert={showAlert}>
        <div className="row w-100 m-0 p-0">
          {carousel && !isIframePage ? (
            <MainHeader
              goHome={goHome}
              loginDone={loginDone}
              startedLogin={startedLogin}
              renderBtnConnect={renderBtnConnect}
              connectUserData={connectUserData}
              setLoginDone={setLoginDone}
              userData={userData}
              creatorViewsDisabled={creatorViewsDisabled}
              showAlert={showAlert}
              selectedChain={selectedChain}
              isSplashPage={isSplashPage}
            />
          ) : (
            !isIframePage && (
              <MenuNavigation
                adminRights={adminRights}
                primaryColor={primaryColor}
                startedLogin={startedLogin}
                connectUserData={connectUserData}
                renderBtnConnect={renderBtnConnect}
                loginDone={loginDone}
                setLoginDone={setLoginDone}
                currentUserAddress={currentUserAddress}
                creatorViewsDisabled={creatorViewsDisabled}
                programmaticProvider={programmaticProvider}
                showAlert={showAlert}
                selectedChain={selectedChain}
              />
            )
          )}

          {/*
							Left sidebar, includes the RAIR logo and the admin sidebar
						*/}
          {carousel ? (
            <div className="col-1 hidden-block">
              <div></div>
            </div>
          ) : (
            <></>
          )}

          {/*
							Main body, the header, router and footer are here
						*/}
          <MainBlockApp showAlert={showAlert} selectedChain={selectedChain}>
            <div className="col-12 blockchain-switcher" />
            <div className="col-12 mt-3 row">
              <SentryRoutes>
                {/*
										Iterate over the routes in the array
										Full object structure: 
										{
											path: {
												type: String,
												required: true
											},
											content: {
												type: JSX tag,
												required: true
											},
											requirement: {
												type: Boolean,
												required: false,
												default: undefined
											},
											exact: {
												type: Boolean,
												required: false,
												default: true
											}
										}
									*/}

                {/*
										Iterate over any splash page and add the connect user data function
										This needs a different map because the requirements for rendering are more
										complex than just a boolean
									*/}
                {[
                  {
                    path: '/simdogs-splash',
                    content: SimDogsSplashPage
                  },
                  {
                    path: '/genesis-splash',
                    content: RAIRGenesisSplashPage
                  },
                  {
                    path: '/wallstreet80sclub',
                    content: Wallstreet80sClubSplashPage
                  },
                  {
                    path: '/coinagenda2021',
                    content: CoinAgenda2021SplashPage
                  },
                  {
                    path: '/immersiverse-splash',
                    content: ImmersiVerseSplashPage
                  },
                  {
                    path: '/nftnyc-splash',
                    content: NFTNYCSplashPage
                  },
                  {
                    path: '/video-tiles-test',
                    content: VideoTilesTest
                  },
                  {
                    path: '/nftla-splash',
                    content: NFTLASplashPage
                  },
                  {
                    path: '/ukraineglitch',
                    content: UkraineSplashPage
                  },
                  {
                    path: '/vaporverse-splash',
                    content: VaporverseSplashPage
                  },
                  {
                    path: '/greyman-splash',
                    content: GreymanSplashPage
                  },
                  {
                    path: '/nutcrackers-splash',
                    content: Nutcrackers
                  },
                  {
                    path: '/nipsey-splash',
                    content: SplashPage
                  },
                  {
                    path: '/slidelock',
                    content: SlideLock
                  },
                  {
                    path: '/about-page',
                    content: AboutPageNew,
                    props: {
                      connectUserData: connectUserData,
                      headerLogoWhite: headerLogoWhite,
                      headerLogoBlack: headerLogoBlack,
                      setIsSplashPage: setIsSplashPage,
                      seoInformation
                    }
                  }
                ].map((item, index) => {
                  // If the path is set as the Home Page, render it as the default path (/)
                  const isHome = item.path === process.env.REACT_APP_HOME_PAGE;

                  if (process.env.REACT_APP_HOME_PAGE !== '/' && !isHome) {
                    return (
                      <React.Fragment
                        key={Math.random() + index}></React.Fragment>
                    );
                  }

                  return (
                    <Route
                      key={index}
                      exact
                      path={isHome ? '/' : item.path}
                      element={
                        <item.content
                          {...{
                            connectUserData,
                            loginDone,
                            setIsSplashPage
                          }}
                        />
                      }
                    />
                  );
                })}
                {[
                  /*
                      If the home page isn't the default '/', it won't show the
                        'Digital Ownership Encryption' message
                    */
                  {
                    path: '/',
                    content: WelcomeHeader,
                    requirement: process.env.REACT_APP_HOME_PAGE === '/',
                    props: {
                      seoInformation,
                      setIsSplashPage,
                      tabIndex: tabIndex,
                      setTabIndex: setTabIndex
                    }
                  },

                  // Old Video Upload view
                  {
                    path: '/admin/fileUpload',
                    content: FileUpload,
                    requirement:
                      loginDone && !creatorViewsDisabled && adminRights,
                    props: {
                      primaryColor: primaryColor,
                      textColor: textColor
                    }
                  },
                  // Token transfers
                  {
                    path: '/admin/transferNFTs',
                    content: TransferTokens,
                    constraint: loginDone && !creatorViewsDisabled
                  },

                  // Creator UI - New Views based on Figma
                  {
                    path: '/creator/deploy',
                    content: Deploy,
                    requirement:
                      loginDone && adminRights && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contracts',
                    content: Contracts,
                    requirement: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/createCollection',
                    content: ContractDetails,
                    requirement: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/listCollections',
                    content: ListCollections,
                    requirement: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/collection/:collectionIndex/*', // NEW: Wildcard allows WorkflowSteps to have routes within
                    content: WorkflowSteps,
                    requirement: loginDone && !creatorViewsDisabled,
                    exact: false
                  },

                  // Old Creator UI (Using the Database)
                  {
                    path: '/new-factory',
                    content: MyContracts,
                    requirement: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/on-sale',
                    content: MinterMarketplace,
                    requirement: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/rair/:contract/:product',
                    content: RairProduct,
                    requirement: loginDone && !creatorViewsDisabled
                  },

                  // Old Token Viewer (Using the database)
                  {
                    path: '/token/:blockchain/:contract/:identifier',
                    content: Token,
                    requirement: loginDone && !creatorViewsDisabled
                  },

                  // Classic Factory (Uses the blockchain)
                  {
                    path: '/factory',
                    content: CreatorMode,
                    requirement:
                      loginDone &&
                      !creatorViewsDisabled &&
                      adminRights &&
                      factoryInstance !== undefined
                  },

                  // Classic Minter Marketplace (Uses the blockchain)
                  {
                    path: '/minter',
                    content: ConsumerMode,
                    requirement:
                      loginDone &&
                      !creatorViewsDisabled &&
                      minterInstance !== undefined
                  },

                  // Diamond Marketplace (Uses the blockchain)
                  {
                    path: '/diamondMinter',
                    content: DiamondMarketplace,
                    requirement:
                      loginDone &&
                      !creatorViewsDisabled &&
                      diamondMarketplaceInstance !== undefined
                  },
                  {
                    path: '/importExternalContracts',
                    content: ImportExternalContracts,
                    constraint: loginDone && !creatorViewsDisabled
                  },
                  {
                    path: '/about-page',
                    content: AboutPageNew,
                    props: {
                      connectUserData: connectUserData,
                      headerLogoWhite: headerLogoWhite,
                      headerLogoBlack: headerLogoBlack,
                      setIsSplashPage: setIsSplashPage,
                      seoInformation
                    }
                  },

                  // Public Facing Routes
                  {
                    path: '/all',
                    content: MockUpPage,
                    props: {
                      tabIndex: tabIndex,
                      setTabIndex: setTabIndex
                    }
                  },
                  {
                    path: '/my-items',
                    content: MyItems,
                    requirement: loginDone,
                    props: { goHome, userData, setIsSplashPage }
                  },
                  {
                    path: '/:contractId/:product/:offer/:token',
                    content: NftDataExternalLink
                  },
                  {
                    path: '/coming-soon',
                    content: ComingSoon
                  },
                  {
                    path: '/coming-soon-nutcrackers',
                    content: ComingSoonNut
                  },
                  {
                    path: '/privacy',
                    content: PrivacyPolicy,
                    props: {
                      setIsSplashPage: setIsSplashPage
                    }
                  },
                  {
                    path: '/terms-use',
                    content: TermsUse,
                    props: {
                      setIsSplashPage: setIsSplashPage
                    }
                  },
                  {
                    path: '/thankyou',
                    content: ThankYouPage
                  },
                  {
                    path: '/inquiries',
                    content: InquiriesPage
                  },

                  //3 Tab Marketplace?
                  {
                    path: '/tokens/:blockchain/:contract/:product/:tokenId',
                    content: NftDataCommonLink,
                    requirement:
                      process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                      'true',
                    props: { loginDone }
                  },
                  {
                    path: '/collection/:blockchain/:contract/:product/:tokenId',
                    content: NftDataCommonLink,
                    requirement:
                      process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                      'true',
                    props: { userData, loginDone }
                  },
                  {
                    path: '/unlockables/:blockchain/:contract/:product/:tokenId',
                    content: NftDataCommonLink,
                    requirement:
                      process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                      'true',
                    props: { userData, loginDone }
                  },

                  {
                    path: '/notifications',
                    content: NotificationPage
                  },
                  // Video Player
                  {
                    path: '/watch/:contract/:videoId/:mainManifest',
                    content: IframePage,
                    props: { loginDone, setIsIframePage }
                  },
                  {
                    path: '/test-iframe/:contract/:videoId/:mainManifest',
                    content: TestIframe,
                    props: { loginDone, setIsIframePage }
                  },
                  {
                    path: '*',
                    content: NotFound,
                    exact: false
                  }
                ].map((item, index) => {
                  // If the requirements for the route aren't met, it won't return anything
                  if (item.requirement !== undefined && !item.requirement) {
                    return (
                      <React.Fragment
                        key={Math.random() + index}></React.Fragment>
                    );
                  }
                  return (
                    <Route
                      key={index}
                      exact={item.exact !== undefined ? item.exact : true}
                      path={item.path}
                      element={<item.content {...item.props} />}
                    />
                  );
                })}
              </SentryRoutes>
            </div>
          </MainBlockApp>
        </div>
      </AppContainerFluid>
      {!isIframePage && <Footer />}
    </ErrorBoundary>
  );
}

export default App;
