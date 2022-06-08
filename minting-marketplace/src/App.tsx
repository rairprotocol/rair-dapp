//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Router, Switch, Route, /*Redirect*/ NavLink, /*useLocation*/ } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJWT, isTokenValid } from './utils/rFetch';

import './App.css';

// React Redux types
import * as Sentry from '@sentry/react';
// import * as ethers from 'ethers';
// import * as colorTypes from './ducks/colors/types';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

import gtag from './utils/gtag';

import jsonwebtoken from 'jsonwebtoken';

//import CSVParser from './components/metadata/csvParser';
import AboutPageNew from './components/AboutPage/AboutPageNew/AboutPageNew';

import BlockChainSwitcher from './components/adminViews/BlockchainSwitcher';
import TransferTokens from './components/adminViews/transferTokens';
import ImportExternalContracts from './components/adminViews/ImportExternalContracts';

import ComingSoon from './components/SplashPage/CommingSoon/CommingSoon';
import ComingSoonNut from './components/SplashPage/CommingSoon/ComingSoonNut';
import ConsumerMode from './components/consumerMode';
import Contracts from './components/creatorStudio/Contracts';
import ContractDetails from './components/creatorStudio/ContractDetails';
import CreatorMode from './components/creatorMode';

import Deploy from './components/creatorStudio/Deploy';

import FileUpload from './components/video/videoUpload/videoUpload';
// import Footer from './components/Footer/Footer';

import GreymanSplashPage from './components/SplashPage/GreymanSplashPage';
import ImmersiVerseSplashPage from './components/SplashPage/ImmersiVerseSplashPage';
import ListCollections from './components/creatorStudio/ListCollections';

import MetadataEditor from './components/metadata/metadataEditor';
import MyContracts from './components/whitelabel/myContracts';
import MinterMarketplace from './components/marketplace/MinterMarketplace';
import MockUpPage from './components/MockUpPage/MockUpPage';
import MyItems from './components/nft/myItems';
import MyNFTs from './components/nft/myNFT';

import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import { NftDataCommonLink } from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
import NftDataExternalLink from './components/MockUpPage/NftList/NftData/NftDataExternalLink';
import NotFound from './components/NotFound/NotFound';
import Nutcrackers from './components/SplashPage/Nutcrackers/Nutcrackers';

import { PrivacyPolicy } from './components/SplashPage/PrivacyPolicy';

import RairProduct from './components/nft/rairCollection';
//Google Analytics
// import ReactGA from 'react-ga';

import SplashPage from './components/SplashPage';
// import setTitle from './utils/setTitle';

import ThankYouPage from './components/ThankYouPage';
import Token from './components/nft/Token';
import { TermsUse } from './components/SplashPage/TermsUse';

import VideoPlayer from './components/video/videoPlayer';

import WorkflowSteps from './components/creatorStudio/workflowSteps';
import Footer from './components/Footer/Footer';
import DiamondMarketplace from './components/ConsumerMode/DiamondMarketplace';

// logos for About Page
import headerLogoWhite from './images/rairTechLogoWhite.png';
import headerLogoBlack from './images/rairTechLogoBlack.png';
import RairFavicon from './components/MockUpPage/assets/rair_favicon.ico'
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'
import { detectBlockchain } from './utils/blockchainData';
import AlertMetamask from './components/AlertMetamask/index';
import NFTLASplashPage from './components/SplashPage/NFTLASplashPage';
import MenuNavigation from './components/Navigation/Menu';
import UkraineSplashPage from './components/SplashPage/UkraineGlitchSplashPage/UkraineSplashPage';
import VaporverseSplashPage from './components/SplashPage/VaporverseSplash/VaporverseSplashPage';
import MetaTags from './components/SeoTags/MetaTags';
import MainHeader from './components/Header/MainHeader';
import SlideLock from './components/SplashPage/SlideLock/SlideLock';
import VideoTilesTest from './components/SplashPage/SplashPageTemplate/VideoTiles/VideosTilesTest';
import { getTokenComplete, getTokenStart } from './ducks/auth/actions';
import { getCurrentPageEnd } from './ducks/pages';
import { setChainId, setUserAddress } from './ducks/contracts';
import { setAdminRights } from './ducks/users/actions';
import axios from 'axios';
import { TUserResponse } from './axios.responseTypes';



const gAppName = process.env.REACT_APP_GA_NAME
const gUaNumber = process.env.REACT_APP_GOOGLE_ANALYTICS
const analytics = Analytics({
  app: gAppName,
  plugins: [
    googleAnalytics({
      trackingId: gUaNumber
    })
  ]
})
/* Track a page view */
analytics.page()

const SentryRoute = Sentry.withSentryRouting(Route);

const ErrorFallback = () => {
  return <div className="not-found-page">
    <h3><span className="text-404">Sorry!</span></h3>
    <p>An error has ocurred</p>
  </div>
};

function App({ sentryHistory }) {
	const dispatch = useDispatch()
	const [userData, setUserData] = useState();
	const [startedLogin, setStartedLogin] = useState(false);
	const [loginDone, setLoginDone] = useState(false);
	const [errorAuth, /*setErrorAuth*/] = useState('');
	const [renderBtnConnect, setRenderBtnConnect] = useState(false);
	const [showAlert, setShowAlert] = useState(true);
	const { currentChain, realChain } = useSelector(store => store.contractStore);
	const { selectedChain, realNameChain } = detectBlockchain(currentChain, realChain);
	const carousel_match = window.matchMedia('(min-width: 900px)')
	const [carousel, setCarousel] = useState(carousel_match.matches)

	const seoInformation = {
		title: "Rair Tech Marketplace",
		contentName: "author",
		content: "Digital Ownership Encryption",
		description: "RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content",
		favicon: RairFavicon,
		faviconMobile: RairFavicon
	}

	// Redux
	const {
		currentUserAddress,
		minterInstance,
		factoryInstance,
		programmaticProvider,
		diamondMarketplaceInstance
	} = useSelector(store => store.contractStore);
	const {
		primaryColor,
		headerLogo,
		textColor,
		backgroundImage,
		backgroundImageEffect
	} = useSelector(store => store.colorStore);
	const { token } = useSelector(store => store.accessStore);
	const { adminRights } = useSelector(store => store.userStore);

	const connectUserData = useCallback(async () => {
		setStartedLogin(true);
		let currentUser;
		let dispatchStack = [];
		if (window.ethereum) {
			let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			dispatchStack.push(setUserAddress(accounts[0]))
			dispatchStack.push(setChainId(window.ethereum.chainId?.toLowerCase()));
			currentUser = accounts[0];
		} else if (programmaticProvider) {
			dispatchStack.push(setUserAddress(programmaticProvider.address));
			dispatchStack.push(setChainId(`0x${programmaticProvider.provider._network.chainId?.toString(16)?.toLowerCase()}`));
			currentUser = programmaticProvider.address;
		}

		if (!currentUser && currentUser !== undefined) {
			Swal.fire('Error', 'No user address found', 'error');
			setStartedLogin(false);
			return;
		}

		try {
			// Check if user exists in DB
			const userData = await axios.get<TUserResponse>(`/api/users/${currentUser}`);
      const { success, user } = userData.data;
			if (!success || !user) {
				// If the user doesn't exist, send a request to register him using a TEMP adminNFT
				console.log('Address is not registered!');
        const userCreation = await axios.post<TUserResponse>('/api/users',  JSON.stringify({ publicAddress: currentUser, adminNFT: 'temp' }), {
          headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
        });
        const { user } = userCreation.data;
				setUserData(user);
			} else {
				setUserData(user);
			}

			// Authorize user and get JWT token
			if (adminRights === null || adminRights === undefined || !localStorage.token || !isTokenValid(localStorage.token)) {
				dispatchStack.push(getTokenStart());
				let token = await getJWT(programmaticProvider, currentUser);

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
			dispatchStack.forEach(dispatchItem => {
				dispatch(dispatchItem);
			})
			setLoginDone(true);
		} catch (err) {
			console.log('Error', err);
			setStartedLogin(false);
		}
	}, [programmaticProvider, adminRights, dispatch]);

	const goHome = () => {
		sentryHistory.push(`/`);
		setShowAlert(false);
		dispatch(getCurrentPageEnd());
	};

	const openAboutPage = useCallback(() => {
		sentryHistory.push(`/about-page`);
		window.scrollTo(0, 0);
	}, [sentryHistory]);

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
		gtag('event', 'page_view', {page_title: window.location.pathname, page_location: window.location.href});
	} , []);

	useEffect(() => {
		// setTitle('Welcome');
		if (process.env.NODE_ENV === 'development') {
			window.gotoRouteBackdoor = sentryHistory.push;
			window.adminAccessBackdoor = (boolean) => {
				dispatch(setAdminRights(boolean));
			};
		}
	}, [dispatch, sentryHistory.push]);

	useEffect(() => {
		btnCheck();
	}, [btnCheck]);

	useEffect(() => {
		window.addEventListener("resize", () => setCarousel(carousel_match.matches));
		return () => window.removeEventListener("resize", () => setCarousel(carousel_match.matches));
	}, [carousel_match.matches])

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
				localStorage.removeItem("token");
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
				let p = document.querySelector('p');
				if (p) {
					let text = p.textContent.split('');
					var len = text.length;
					var phaseJump = 360 / len;
					var spans;
					p.innerHTML = text
						.map(function (char) {
							return '<span>' + char + '</span>';
						})
						.join('');

					spans = p.children;
				} else console.log('kik');

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
					for (var i = 0; i < len; i++) {
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
		if (!selectedChain) return

		if (!showAlert) {
			setShowAlert(true)
		}
		//eslint-disable-next-line
	}, [selectedChain]);

	let creatorViewsDisabled = process.env.REACT_APP_DISABLE_CREATOR_VIEWS === 'true';

	return (
    <Sentry.ErrorBoundary fallback={ErrorFallback}>
      {selectedChain && showAlert ? <AlertMetamask selectedChain={selectedChain} realNameChain={realNameChain} setShowAlert={setShowAlert} /> : null}
      <Router history={sentryHistory}>
        <div
          className="App p-0 container-fluid"
          style={{
            ...backgroundImageEffect,
            backgroundSize: '100vw 100vh',
            minHeight: '90vh',
            position: 'relative',
            backgroundColor: `var(--${primaryColor})`,
            color: textColor,
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            overflow: "hidden"
          }}
        >
          <div className='row w-100 m-0 p-0'>
            {carousel ? <MainHeader
              goHome={goHome}
              loginDone={loginDone}
              startedLogin={startedLogin}
              renderBtnConnect={renderBtnConnect}
              connectUserData={connectUserData}
              setLoginDone={setLoginDone}
              userData={userData}
              errorAuth={errorAuth}
              sentryHistory={sentryHistory}
              creatorViewsDisabled={creatorViewsDisabled}
              showAlert={showAlert}
              selectedChain={selectedChain}
            /> : <MenuNavigation
              adminRights={adminRights}
              primaryColor={primaryColor}
              headerLogo={headerLogo}
              startedLogin={startedLogin}
              connectUserData={connectUserData}
              renderBtnConnect={renderBtnConnect}
              loginDone={loginDone}
              setLoginDone={setLoginDone}
              currentUserAddress={currentUserAddress}
              creatorViewsDisabled={creatorViewsDisabled}
            />}

            {/*
							Left sidebar, includes the RAIR logo and the admin sidebar
						*/}
            {carousel ? <div className='col-1 hidden-block'
            >

              <div>

              </div>
            </div> : <></>
            }

            {/*
							Main body, the header, router and footer are here
						*/}
            <div className={`col-12 col-md-${adminRights ? "11" : "11"}`}
              style={{ marginTop: 40 }}
            >
              <div
                className="col-12 blockchain-switcher"
                style={{ height: "10vh" }}
              >
                <Switch>
                  <SentryRoute path="/admin" component={BlockChainSwitcher} />
                </Switch>
              </div>
              <div className="col-12 mt-3 row">
                <Switch>
                  {/*
										Iterate over the routes in the array
										Order matters!
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
                  {
                    [
                      {
                        path: '/immersiverse-splash',
                        content: ImmersiVerseSplashPage
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
                        path: '/about-page',
                        content: AboutPageNew
                      },
                      {
                        path: '/slidelock',
                        content: SlideLock
                      },
                    ].map((item, index) => {
                      // If the path is set as the Home Page, render it as the default path (/)
                      let isHome = item.path === process.env.REACT_APP_HOME_PAGE;

                      if (process.env.REACT_APP_HOME_PAGE !== '/' && !isHome) {
                        return undefined;
                      }

                      return <SentryRoute key={index} exact path={isHome ? '/' : item.path}>
                        <item.content {...{ connectUserData }} loginDone={loginDone} />
                      </SentryRoute>
                    })
                  }
                  {[

                    /*
                      If the home page isn't the default '/', it won't show the
                        'Digital Ownership Encryption' message
                    */
                    {
                      path: "/",
                      content: (
                        <div className="main-wrapper">
                          <MetaTags seoMetaTags={seoInformation} />
                          <div className="col-6 text-left main">
                            <h1 className="w-100" style={{ textAlign: "left" }}>
                              Digital <b className="title">Ownership</b>
                              <br />
                              Encryption
                            </h1>
                            <p className="w-100" style={{ textAlign: "left" }}>
                              RAIR is a Blockchain-based digital rights
                              management platform that uses NFTs to gate access
                              to streaming content
                            </p>
                          </div>
                          <div className="col-12 mt-3 row">
                            <MockUpPage />
                          </div>
                        </div>
                      ),
                      requirement: process.env.REACT_APP_HOME_PAGE === "/",
                    },

                    // Creator UI - New Views based on Figma
                    {
                      path: "/creator/deploy",
                      content: <Deploy />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/creator/contracts",
                      content: <Contracts />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/creator/contract/:blockchain/:address/createCollection",
                      content: <ContractDetails />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/creator/contract/:blockchain/:address/listCollections",
                      content: <ListCollections />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/",
                      content: <WorkflowSteps {...{ sentryHistory }} />,
                      requirement: loginDone && !creatorViewsDisabled,
                      exact: false,
                    },

                    // Old Creator UI (Using the Database)
                    {
                      path: "/new-factory",
                      content: <MyContracts />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/on-sale",
                      content: <MinterMarketplace />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/rair/:contract/:product",
                      content: <RairProduct />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },

                    // Old Video Upload view
                    {
                      path: "/admin",
                      content: (
                        <FileUpload
                          primaryColor={primaryColor}
                          textColor={textColor}
                        />
                      ),
                      requirement:
                        loginDone && !creatorViewsDisabled && adminRights,
                    },

                    // Old Metadata Editor
                    {
                      path: "/metadata/:blockchain/:contract/:product",
                      content: <MetadataEditor />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },

                    // Old MyNFTs (Using the database)
                    {
                      path: "/my-nft",
                      content: <MyNFTs />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },

                    // Old Token Viewer (Using the database)
                    {
                      path: "/token/:blockchain/:contract/:identifier",
                      content: <Token />,
                      requirement: loginDone && !creatorViewsDisabled,
                    },

                    // Classic Factory (Uses the blockchain)
                    {
                      path: "/factory",
                      content: <CreatorMode />,
                      requirement:
                        loginDone &&
                        !creatorViewsDisabled &&
                        factoryInstance !== undefined,
                    },

                    // Classic Minter Marketplace (Uses the blockchain)
                    {
                      path: "/minter",
                      content: <ConsumerMode />,
                      requirement:
                        loginDone &&
                        !creatorViewsDisabled &&
                        minterInstance !== undefined,
                    },

                    // Diamond Marketplace (Uses the blockchain)
                    {
                      path: "/diamondMinter",
                      content: <DiamondMarketplace />,
                      requirement:
                        loginDone &&
                        !creatorViewsDisabled &&
                        diamondMarketplaceInstance !== undefined,
                    },
                    {
                      path: "/admin/transferNFTs",
                      content: <TransferTokens />,
                      constraint: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/importExternalContracts",
                      content: <ImportExternalContracts />,
                      constraint: loginDone && !creatorViewsDisabled,
                    },
                    {
                      path: "/about-page",
                      content: (
                        <AboutPageNew
                          connectUserData={connectUserData}
                          headerLogoWhite={headerLogoWhite}
                          headerLogoBlack={headerLogoBlack}
                        />
                      ),
                    },

                    /*
                      Public Facing Routes
                    */
                    {
                      path: "/all",
                      content: <MockUpPage />,
                    },
                    {
                      path: "/my-items",
                      content: <MyItems goHome={goHome} />,
                      requirement: loginDone,
                    },
                    {
                      path: "/:contractId/:product/:offer/:token",
                      content: (
                        <NftDataExternalLink
                          currentUser={currentUserAddress}
                          primaryColor={primaryColor}
                          textColor={textColor}
                        />
                      ),
                    },
                    {
                      path: "/coming-soon",
                      content: <ComingSoon />,
                    },
                    {
                      path: "/coming-soon-nutcrackers",
                      content: <ComingSoonNut />,
                    },
                    {
                      path: "/privacy",
                      content: <PrivacyPolicy />,
                    },
                    {
                      path: "/terms-use",
                      content: <TermsUse />,
                    },
                    {
                      path: "/thankyou",
                      content: <ThankYouPage />,
                    },

                    /*
                      3 Tab Marketplace?
                    */
                    {
                      path: "/:tokens/:blockchain/:contract/:product/:tokenId",
                      content: <NftDataCommonLink userData={userData} />,
                      requirement:
                        process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                        "true",
                    },
                    {
                      path: "/:collection/:blockchain/:contract/:product/:tokenId",
                      content: <NftDataCommonLink userData={userData} />,
                      requirement:
                        process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                        "true",
                    },
                    {
                      path: "/:unlockables/:blockchain/:contract/:product/:tokenId",
                      content: <NftDataCommonLink userData={userData} />,
                      requirement:
                        process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !==
                        "true",
                    },

                    {
                      path: "/notifications",
                      content: <NotificationPage />,
                    },
                    // Video Player
                    {
                      path: "/watch/:videoId/:mainManifest",
                      content: <VideoPlayer />,
                      exact: false,
                    },

                    // Default route, leave this at the bottom always
                    {
                      path: "",
                      content: <NotFound />,
                      exact: false,
                    },
                  ].map((item, index) => {
                    // If the requirements for the route aren't met, it won't return anything
                    if (item.requirement !== undefined && !item.requirement) {
                      return null;
                    }
                    return (
                      <SentryRoute
                        key={index}
                        exact={item.exact !== undefined ? item.exact : true}
                        path={item.path}
                        render={() => item.content}
                      />
                    );
                  })}
                </Switch>
              </div>
            </div>
          </div>
        </div>
        <Footer
          sentryHistory={sentryHistory}
          openAboutPage={openAboutPage}
          primaryColor={primaryColor}
        />
      </Router>
    </Sentry.ErrorBoundary>
  );
}

export default App;
