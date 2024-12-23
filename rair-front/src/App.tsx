import { Fragment, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ErrorBoundary, withSentryReactRouterV6Routing } from "@sentry/react";

import AboutPageNew from "./components/AboutPage/AboutPageNew/AboutPageNew";
import ImportAndTransfer from "./components/adminViews/ImportAndTransfer";
import ImportExternalContracts from "./components/adminViews/ImportExternalContracts";
import LicenseExchange from "./components/adminViews/LicenseExchange";
import AlertMetamask from "./components/AlertMetamask/index";
import Footer from "./components/Footer/Footer";
import MainHeader from "./components/Header/MainHeader";
import IframePage from "./components/iframePage/IframePage";
import TestIframe from "./components/iframePage/testIframe";
import MinterMarketplace from "./components/marketplace/MinterMarketplace";
import { NftDataCommonLink } from "./components/MockUpPage/NftList/NftData/NftDataCommonLink";
import NftDataExternalLink from "./components/MockUpPage/NftList/NftData/NftDataExternalLink";
import MenuNavigation from "./components/Navigation/Menu";
import RairProduct from "./components/nft/rairCollection";
import NotFound from "./components/NotFound/NotFound";
import ResalePage from "./components/ResalePage/ResalePage";
import MetaTags from "./components/SeoTags/MetaTags";
import ServerSettings from "./components/ServerSettings";
import { PrivacyPolicy } from "./components/SplashPage/PrivacyPolicyPage/PrivacyPolicy";
import { TermsUse } from "./components/SplashPage/TermsUsePage/TermsUse";
import UserProfilePage from "./components/UserProfilePage/UserProfilePage";
import VideoManager from "./components/videoManager/VideoManager";
import useConnectUser from "./hooks/useConnectUser";
import useContracts from "./hooks/useContracts";
import { useAppDispatch, useAppSelector } from "./hooks/useReduxHooks";
import useWeb3Tx from "./hooks/useWeb3Tx";
import { loadCategories, loadSettings } from "./redux/settingsSlice";
import { setConnectedChain } from "./redux/web3Slice";
import {
  AppContainerFluid,
  MainBlockApp,
} from "./styled-components/nft/AppContainer";
import { detectBlockchain } from "./utils/blockchainData";
// import getInformationGoogleAnalytics from './utils/googleAnalytics';
import gtag from "./utils/gtag";
// views
import ErrorFallback from "./views/ErrorFallback/ErrorFallback";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/Home/Home";

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
    programmaticProvider,
  } = useAppSelector((store) => store.web3);
  const [isAboutPage, setIsAboutPage] = useState<boolean>(false);
  const { realNameChain } = detectBlockchain(connectedChain, requestedChain);
  const seo = useAppSelector((store) => store.seo);
  const carousel_match = window.matchMedia("(min-width: 1025px)");
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [tabIndexItems, setTabIndexItems] = useState(0);
  const [tokenNumber, setTokenNumber] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // Redux
  const {
    primaryColor,
    textColor,
    backgroundImage,
    backgroundImageEffect,
    isDarkMode,
  } = useAppSelector((store) => store.colors);
  const { adminRights, isLoggedIn } = useAppSelector((store) => store.user);

  const { correctBlockchain } = useWeb3Tx();

  const { logoutUser } = useConnectUser();

  const { pathname } = useLocation();

  const showAlertHandler = useCallback(() => {
    setShowAlert(
      !!(
        (pathname !== "/" || isSplashPage) &&
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
    requestedChain,
  ]);

  useEffect(() => showAlertHandler(), [showAlertHandler]);

  const goHome = () => {
    navigate("/");
    sessionStorage.removeItem("CategoryItems");
    sessionStorage.removeItem("BlockchainItems");
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
      window.ethereum.on("chainChanged", foo);
      window.ethereum.on("accountsChanged", logoutUser);
      return () => {
        window.ethereum.off("chainChanged", foo);
        window.ethereum.off("accountsChanged", logoutUser);
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
    window.addEventListener("resize", () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener("resize", () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  const hotDropsVar = import.meta.env.VITE_TESTNET;

  useEffect(() => {
    if (hotDropsVar === "true") {
      document.body.classList.add("hotdrops");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const creatorViewsDisabled =
    import.meta.env.VITE_DISABLE_CREATOR_VIEWS === "true";

  useEffect(() => {
    // dispatch(loadSettings());
    dispatch(loadCategories());
  }, []);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MetaTags seoMetaTags={seo} />
      {showAlert === true && <AlertMetamask setShowAlert={setShowAlert} />}
      <AppContainerFluid
        id="App"
        className={`App`}
        backgroundImageEffect={backgroundImageEffect}
        isDarkMode={isDarkMode}
        textColor={textColor}
        primaryColor={primaryColor}
        backgroundImage={hotDropsVar === "true" ? "" : backgroundImage}
      >
        <div className="">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                backgroundColor: primaryColor,
                color: textColor,
                border: `solid 1px ${textColor}`,
                marginRight: "2vw",
              },
            }}
          />
          {/* {carousel && !isIframePage ? ( */}
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
                  /*
                      If the home page isn't the default '/', it won't show the
                        'Digital Ownership Encryption' message
                    */
                  {
                    path: "/",
                    content: <Home  />,
                  },
                  {
                    path: "/user/videos",
                    content: <VideoManager />,
                  },

                  // Server Settings view
                  {
                    path: "/admin/settings",
                    content: <ServerSettings />,
                    requirement:
                      isLoggedIn && !creatorViewsDisabled && adminRights,
                  },
                  // License UI
                  {
                    path: "/license",
                    content: <LicenseExchange />,
                    requirement: isLoggedIn && !creatorViewsDisabled,
                  },
                  // Token transfers
                  {
                    path: "/admin/transferNFTs",
                    content: <ImportAndTransfer />,
                    constraint: isLoggedIn && !creatorViewsDisabled,
                  },
                  // Resale offers page
                  {
                    path: "/resale-offers",
                    content: <ResalePage />,
                    requirement:
                      isLoggedIn && adminRights && !creatorViewsDisabled,
                  },

                  // Old Creator UI (Using the Database)
                  {
                    path: "/on-sale",
                    content: <MinterMarketplace />,
                    requirement: isLoggedIn && !creatorViewsDisabled,
                  },
                  {
                    path: "/rair/:contract/:product",
                    content: <RairProduct />,
                    requirement: isLoggedIn && !creatorViewsDisabled,
                  },
                  {
                    path: "/importExternalContracts",
                    content: <ImportExternalContracts />,
                    constraint: isLoggedIn && !creatorViewsDisabled,
                  },
                  {
                    path: "/about-page",
                    content: (
                      <AboutPageNew
                        {...{
                          setIsSplashPage,
                        }}
                      />
                    ),
                  },

                  {
                    path: "/:userAddress",
                    content: <UserProfilePage />,
                  },
                  {
                    path: "/:contractId/:product/:offer/:token",
                    content: <NftDataExternalLink />,
                  },
                  {
                    path: "/privacy",
                    content: <PrivacyPolicy {...{ setIsSplashPage }} />,
                  },
                  {
                    path: "/terms-use",
                    content: <TermsUse {...{ setIsSplashPage }} />,
                  },
                  {
                    path: "/:userAddress",
                    content: <UserProfilePage />,
                  },

                  //3 Tab Marketplace?
                  {
                    path: "/tokens/:blockchain/:contract/:product/:tokenId",
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber,
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !==
                      "true",
                  },
                  {
                    path: "/collection/:blockchain/:contract/:product/:tokenId",
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber,
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !==
                      "true",
                  },
                  {
                    path: "/unlockables/:blockchain/:contract/:product/:tokenId",
                    content: (
                      <NftDataCommonLink
                        {...{
                          setTokenNumber,
                          tokenNumber,
                        }}
                      />
                    ),
                    requirement:
                      import.meta.env.VITE_3_TAB_MARKETPLACE_DISABLED !==
                      "true",
                  },

                  // Video Player
                  {
                    path: "/watch/:contract/:videoId/:mainManifest",
                    content: (
                      <IframePage
                        {...{
                          setIsIframePage,
                          renderBtnConnect,
                          programmaticProvider,
                        }}
                      />
                    ),
                  },
                  {
                    path: "/test-iframe/:contract/:videoId/:mainManifest",
                    content: <TestIframe {...{ setIsIframePage }} />,
                  },
                  {
                    path: "*",
                    content: <NotFound />,
                  },
                  {
                    path: "/404",
                    content: <NotFound />,
                  },
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
