import { Fragment, useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary, withSentryReactRouterV6Routing } from '@sentry/react';

import AboutPageNew from './components/AboutPage/AboutPageNew/AboutPageNew';
import ImportAndTransfer from './components/adminViews/ImportAndTransfer';
import ImportExternalContracts from './components/adminViews/ImportExternalContracts';
import LicenseExchange from './components/adminViews/LicenseExchange';
import AlertMetamask from './components/AlertMetamask/index';
import DiamondMarketplace from './components/ConsumerMode/DiamondMarketplace';
import ContractDetails from './components/creatorStudio/ContractDetails';
import Contracts from './components/creatorStudio/Contracts';
import Deploy from './components/creatorStudio/Deploy';
import ListCollections from './components/creatorStudio/ListCollections';
import WorkflowSteps from './components/creatorStudio/workflowSteps';
import DemoMediaUpload from './components/DemoMediaUpload/DemoMediaUpload';
import Footer from './components/Footer/Footer';
import WelcomeHeader from './components/FrontPage/WelcomeHeader';
import MainHeader from './components/Header/MainHeader';
import IframePage from './components/iframePage/IframePage';
import TestIframe from './components/iframePage/testIframe';
import InquiriesPage from './components/InquiriesPage/InquiriesPage';
import MainPage from './components/MainPage/MainPage';
import MinterMarketplace from './components/marketplace/MinterMarketplace';
import MockUpPage from './components/MockUpPage/MockUpPage';
import { NftDataCommonLink } from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
import NftDataExternalLink from './components/MockUpPage/NftList/NftData/NftDataExternalLink';
import MenuNavigation from './components/Navigation/Menu';
import RairProduct from './components/nft/rairCollection';
import Token from './components/nft/Token';
import NotFound from './components/NotFound/NotFound';
import ResalePage from './components/ResalePage/ResalePage';
import MetaTags from './components/SeoTags/MetaTags';
import ServerSettings from './components/ServerSettings';
import CoinAgenda2021SplashPage from './components/SplashPage/CoinAgenda2021/CoinAgenda2021';
import ComingSoonNut from './components/SplashPage/CommingSoon/ComingSoonNut';
import ComingSoon from './components/SplashPage/CommingSoon/CommingSoon';
import GreymanSplashPage from './components/SplashPage/Greyman/GreymanSplashPage';
import ImmersiVerseSplashPage from './components/SplashPage/ImmersiVerse/ImmersiVerseSplashPage';
import MarkKohler from './components/SplashPage/MarkKohler/MarkKohler';
import NFTLASplashPage from './components/SplashPage/NFTLA/NFTLASplashPage';
import NFTNYCSplashPage from './components/SplashPage/NFTNYC/NFTNYC';
import SplashPage from './components/SplashPage/Nipseyverse';
import Nutcrackers from './components/SplashPage/Nutcrackers/Nutcrackers';
import { PrivacyPolicy } from './components/SplashPage/PrivacyPolicyPage/PrivacyPolicy';
import RAIRGenesisSplashPage from './components/SplashPage/RAIRGenesis/RAIRGenesis';
import SimDogsSplashPage from './components/SplashPage/SimDogs/SimDogs';
import SlideLock from './components/SplashPage/SlideLock/SlideLock';
import VideoTilesTest from './components/SplashPage/SplashPageTemplate/VideoTiles/VideosTilesTest';
import { TermsUse } from './components/SplashPage/TermsUsePage/TermsUse';
import UkraineSplashPage from './components/SplashPage/UkraineGlitchSplashPage/UkraineSplashPage';
import VaporverseSplashPage from './components/SplashPage/VaporverseSplash/VaporverseSplashPage';
import Wallstreet80sClubSplashPage from './components/SplashPage/wallstreet80sclub/wallstreet80sclub';
import ThankYouPage from './components/ThankYouPage';
import UserProfilePage from './components/UserProfilePage/UserProfilePage';
import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import VideoManager from './components/videoManager/VideoManager';
import YotiPage from './components/YotiPage/YotiPage';
import useConnectUser from './hooks/useConnectUser';
import useContracts from './hooks/useContracts';
import { useAppDispatch, useAppSelector } from './hooks/useReduxHooks';
import useWeb3Tx from './hooks/useWeb3Tx';
import { loadCategories, loadSettings } from './redux/settingsSlice';
import { setConnectedChain } from './redux/web3Slice';
import {
  AppContainerFluid,
  MainBlockApp
} from './styled-components/nft/AppContainer';
import { detectBlockchain } from './utils/blockchainData';
// import getInformationGoogleAnalytics from './utils/googleAnalytics';
import gtag from './utils/gtag';
// views
import ErrorFallback from './views/ErrorFallback/ErrorFallback';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
/* Track a page view */
// const analytics = getInformationGoogleAnalytics();
// analytics.page();

const SentryRoutes = withSentryReactRouterV6Routing(Routes);

function App() {
  const dispatch = useAppDispatch();
  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const [renderBtnConnect, setRenderBtnConnect] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isSplashPage, setIsSplashPage] = useState(false);
  const [isIframePage, setIsIframePage] = useState<boolean>(false);
  const {
    connectedChain,
    requestedChain,
    currentUserAddress,
    programmaticProvider
  } = useAppSelector((store) => store.web3);
  const { diamondMarketplaceInstance } = useContracts();
  const [isAboutPage, setIsAboutPage] = useState<boolean>(false);
  const { realNameChain } = detectBlockchain(connectedChain, requestedChain);
  const seo = useAppSelector((store) => store.seo);
  const carousel_match = window.matchMedia('(min-width: 1025px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabIndexItems, setTabIndexItems] = useState(0);
  const [tokenNumber, setTokenNumber] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // Redux
  const {
    primaryColor,
    textColor,
    backgroundImage,
    backgroundImageEffect,
    isDarkMode
  } = useAppSelector((store) => store.colors);
  const { adminRights, isLoggedIn } = useAppSelector((store) => store.user);

  const { correctBlockchain } = useWeb3Tx();

  const { logoutUser } = useConnectUser();

  const { pathname } = useLocation();

  const showAlertHandler = useCallback(() => {
    setShowAlert(
      !!(
        (pathname !== '/' || isSplashPage) &&
        currentUserAddress &&
        realNameChain &&
        !correctBlockchain(requestedChain)
      )
    );
  }, [
    pathname,
    isSplashPage,
    currentUserAddress,
    realNameChain,
    correctBlockchain,
    requestedChain
  ]);

  useEffect(() => showAlertHandler(), [showAlertHandler]);

  const goHome = () => {
    navigate('/');
    sessionStorage.removeItem('CategoryItems');
    sessionStorage.removeItem('BlockchainItems');
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
      const foo = async (chainId) => {
        dispatch(setConnectedChain(chainId));
      };
      window.ethereum.on('chainChanged', foo);
      window.ethereum.on('accountsChanged', logoutUser);
      return () => {
        window.ethereum.off('chainChanged', foo);
        window.ethereum.off('accountsChanged', logoutUser);
      };
    }
  }, [dispatch, logoutUser, blockchainSettings]);

  // gtag

  useEffect(() => {
    gtag(/*'event', 'page_view', {
      page_title: window.location.pathname,
      page_location: window.location.href
    }*/);
  }, []);

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

  useEffect(() => {
    if (isDarkMode) {
      (function () {
        let angle = 0;
        const p = document.querySelector('p');
        if (p?.textContent) {
          const text = p.textContent.split('');
          // eslint-disable-next-line no-var
          var len = text.length;
          // eslint-disable-next-line no-var
          var phaseJump = 360 / len;
          // eslint-disable-next-line no-var
          var spans;
          p.innerHTML = text
            .map(function (char) {
              return '<span>' + char + '</span>';
            })
            .join('');

          spans = p.children;
        } else return;

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
  }, [isDarkMode]);

  const hotDropsVar = import.meta.env.VITE_TESTNET;

  useEffect(() => {
    if (hotDropsVar === 'true') {
      document.body.classList.add('hotdrops');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const creatorViewsDisabled =
    import.meta.env.VITE_DISABLE_CREATOR_VIEWS === 'true';

  useEffect(() => {
    dispatch(loadSettings());
    dispatch(loadCategories());
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MetaTags seoMetaTags={seo} />
      {showAlert === true && <AlertMetamask setShowAlert={setShowAlert} />}
      <AppContainerFluid
        id="App"
        className={`App p-0 container-fluid`}
        backgroundImageEffect={backgroundImageEffect}
        isDarkMode={isDarkMode}
        textColor={textColor}
        primaryColor={primaryColor}
        backgroundImage={hotDropsVar === 'true' ? '' : backgroundImage}>
        <div className="row w-100 m-0 p-0">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                backgroundColor: primaryColor,
                color: textColor,
                border: `solid 1px ${textColor}`,
                marginRight: '2vw'
              }
            }}
          />
          {carousel && !isIframePage ? (
            <MainHeader
              goHome={goHome}
              renderBtnConnect={renderBtnConnect}
              creatorViewsDisabled={creatorViewsDisabled}
              showAlert={showAlert}
              isSplashPage={isSplashPage}
              realChainId={realNameChain && requestedChain}
              setTabIndexItems={setTabIndexItems}
              isAboutPage={isAboutPage}
              setTokenNumber={setTokenNumber}
            />
          ) : (
            !isIframePage && (
              <MenuNavigation
                realChainId={realNameChain && requestedChain}
                isSplashPage={isSplashPage}
                renderBtnConnect={renderBtnConnect}
                currentUserAddress={currentUserAddress}
                showAlert={showAlert}
                setTabIndexItems={setTabIndexItems}
                isAboutPage={isAboutPage}
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
          <MainBlockApp isSplashPage={isSplashPage} showAlert={showAlert}>
            <div className="col-12 blockchain-switcher" />
            <div className="col-12 mt-3">
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
                    content: <SimDogsSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/markkohler-splash',
                    content: <MarkKohler {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/genesis-splash',
                    content: <RAIRGenesisSplashPage />
                  },
                  {
                    path: '/wallstreet80sclub',
                    content: (
                      <Wallstreet80sClubSplashPage {...{ setIsSplashPage }} />
                    )
                  },
                  {
                    path: '/coinagenda2021',
                    content: (
                      <CoinAgenda2021SplashPage {...{ setIsSplashPage }} />
                    )
                  },
                  {
                    path: '/immersiverse-splash',
                    content: <ImmersiVerseSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/nftnyc-splash',
                    content: <NFTNYCSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/video-tiles-test',
                    content: <VideoTilesTest {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/nftla-splash',
                    content: <NFTLASplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/ukraineglitch',
                    content: <UkraineSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/vaporverse-splash',
                    content: <VaporverseSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/greyman-splash',
                    content: <GreymanSplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/nutcrackers-splash',
                    content: <Nutcrackers {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/nipsey-splash',
                    content: <SplashPage {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/slidelock',
                    content: <SlideLock {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/yoti-page',
                    content: <YotiPage />
                  },
                  {
                    path: '/about-page',
                    content: <AboutPageNew {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/main-page',
                    content: (
                      <MainPage
                        {...{
                          setIsSplashPage,
                          setIsAboutPage
                        }}
                      />
                    )
                  }
                ].map((item, index) => {
                  // If the path is set as the Home Page, render it as the default path (/)
                  const isHome = item.path === import.meta.env.VITE_HOME_PAGE;

                  if (import.meta.env.VITE_HOME_PAGE !== '/' && !isHome) {
                    return <Fragment key={index} />;
                  }

                  return (
                    <Route
                      key={index}
                      path={isHome ? '/' : item.path}
                      element={item.content}
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
                    content: (
                      <WelcomeHeader
                        {...{
                          setIsSplashPage,
                          tabIndex: tabIndex,
                          setTabIndex: setTabIndex
                        }}
                      />
                    ),
                    requirement: import.meta.env.VITE_HOME_PAGE === '/'
                  },
                  {
                    path: '/demo/upload',
                    content: <DemoMediaUpload />,
                    requirement:
                      hotDropsVar === 'true'
                        ? isLoggedIn && adminRights
                        : isLoggedIn
                  },
                  {
                    path: '/user/videos',
                    content: <VideoManager />
                  },

                  // Server Settings view
                  {
                    path: '/admin/settings',
                    content: <ServerSettings />,
                    requirement:
                      isLoggedIn && !creatorViewsDisabled && adminRights
                  },
                  // License UI
                  {
                    path: '/license',
                    content: <LicenseExchange />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },
                  // Token transfers
                  {
                    path: '/admin/transferNFTs',
                    content: <ImportAndTransfer />,
                    constraint: isLoggedIn && !creatorViewsDisabled
                  },
                  // Resale offers page
                  {
                    path: '/resale-offers',
                    content: <ResalePage />,
                    requirement:
                      isLoggedIn && adminRights && !creatorViewsDisabled
                  },
                  // Creator UI - New Views based on Figma
                  {
                    path: '/creator/deploy',
                    content: <Deploy />,
                    requirement:
                      isLoggedIn && adminRights && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contracts',
                    content: <Contracts />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/createCollection',
                    content: <ContractDetails />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/listCollections',
                    content: <ListCollections />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },
                  {
                    path: '/creator/contract/:blockchain/:address/collection/:collectionIndex/*', // NEW: Wildcard allows WorkflowSteps to have routes within
                    content: <WorkflowSteps />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },

                  // Old Creator UI (Using the Database)
                  {
                    path: '/on-sale',
                    content: <MinterMarketplace />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },
                  {
                    path: '/rair/:contract/:product',
                    content: <RairProduct />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },

                  // Old Token Viewer (Using the database)
                  {
                    path: '/token/:blockchain/:contract/:identifier',
                    content: <Token />,
                    requirement: isLoggedIn && !creatorViewsDisabled
                  },

                  // Diamond Marketplace (Uses the blockchain)
                  {
                    path: '/diamondMinter',
                    content: <DiamondMarketplace />,
                    requirement:
                      isLoggedIn &&
                      !creatorViewsDisabled &&
                      diamondMarketplaceInstance !== undefined
                  },
                  {
                    path: '/importExternalContracts',
                    content: <ImportExternalContracts />,
                    constraint: isLoggedIn && !creatorViewsDisabled
                  },
                  {
                    path: '/about-page',
                    content: (
                      <AboutPageNew
                        {...{
                          setIsSplashPage
                        }}
                      />
                    )
                  },

                  // Public Facing Routes
                  {
                    path: '/all',
                    content: (
                      <MockUpPage
                        {...{
                          tabIndex: tabIndex,
                          setTabIndex: setTabIndex
                        }}
                      />
                    )
                  },
                  {
                    path: '/:userAddress',
                    content: <UserProfilePage />
                  },
                  {
                    path: '/:contractId/:product/:offer/:token',
                    content: <NftDataExternalLink />
                  },
                  {
                    path: '/coming-soon',
                    content: <ComingSoon />
                  },
                  {
                    path: '/coming-soon-nutcrackers',
                    content: <ComingSoonNut />
                  },
                  {
                    path: '/privacy',
                    content: <PrivacyPolicy {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/terms-use',
                    content: <TermsUse {...{ setIsSplashPage }} />
                  },
                  {
                    path: '/:userAddress',
                    content: <UserProfilePage />
                  },
                  {
                    path: '/thankyou',
                    content: <ThankYouPage />
                  },
                  {
                    path: '/inquiries',
                    content: <InquiriesPage />
                  },

                  //3 Tab Marketplace?
                  {
                    path: '/tokens/:blockchain/:contract/:product/:tokenId',
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !== 'true'
                  },
                  {
                    path: '/collection/:blockchain/:contract/:product/:tokenId',
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !== 'true'
                  },
                  {
                    path: '/unlockables/:blockchain/:contract/:product/:tokenId',
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !== 'true'
                  },

                  {
                    path: '/notifications',
                    content: <NotificationPage />
                  },
                  // Video Player
                  {
                    path: '/watch/:contract/:videoId/:mainManifest',
                    content: (
                      <IframePage
                        {...{
                          setIsIframePage,
                          renderBtnConnect,
                          programmaticProvider
                        }}
                      />
                    )
                  },
                  {
                    path: '/test-iframe/:contract/:videoId/:mainManifest',
                    content: <TestIframe {...{ setIsIframePage }} />
                  },
                  {
                    path: '*',
                    content: <NotFound />
                  },
                  {
                    path: '/404',
                    content: <NotFound />
                  }
                ].map((item, index) => {
                  // If the requirements for the route aren't met, it won't return anything
                  if (item.requirement !== undefined && !item.requirement) {
                    return <Fragment key={Math.random() + index}></Fragment>;
                  }
                  return (
                    <Route
                      key={index}
                      path={item.path}
                      element={item.content}
                    />
                  );
                })}
              </SentryRoutes>
            </div>
          </MainBlockApp>
        </div>
      </AppContainerFluid>
      {!isIframePage && <Footer isSplashPage={isSplashPage} />}
    </ErrorBoundary>
  );
}

export default App;
