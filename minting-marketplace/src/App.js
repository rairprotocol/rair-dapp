import { useState, useEffect, useCallback } from 'react';
import { Router, Switch, Route, /*Redirect*/ NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJWT, isTokenValid } from './utils/rFetch.js';

import './App.css';

// React Redux types
import * as contractTypes from './ducks/contracts/types.js';
import * as userTypes from './ducks/users/types.js';
import * as authTypes from './ducks/auth/types.js';
import * as Sentry from '@sentry/react';
// import * as ethers from 'ethers';
// import * as colorTypes from './ducks/colors/types.js';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

import jsonwebtoken from 'jsonwebtoken';

//import CSVParser from './components/metadata/csvParser.jsx';
import AboutPageNew from './components/AboutPage/AboutPageNew/AboutPageNew';

import BlockChainSwitcher from './components/adminViews/BlockchainSwitcher.jsx';
import TransferTokens from './components/adminViews/transferTokens.jsx';

import ComingSoon from './components/SplashPage/CommingSoon/CommingSoon';
import ComingSoonNut from './components/SplashPage/CommingSoon/ComingSoonNut';
import ConsumerMode from './components/consumerMode.jsx';
import Contracts from './components/creatorStudio/Contracts.jsx';
import ContractDetails from './components/creatorStudio/ContractDetails.jsx';
import CreatorMode from './components/creatorMode.jsx';

import Deploy from './components/creatorStudio/Deploy.jsx';

import FileUpload from './components/video/videoUpload/videoUpload.jsx';
// import Footer from './components/Footer/Footer';

import GreymanSplashPage from './components/SplashPage/GreymanSplashPage';
import ImmersiVerseSplashPage from './components/SplashPage/ImmersiVerseSplashPage';
import ListCollections from './components/creatorStudio/ListCollections.jsx';

import MetadataEditor from './components/metadata/metadataEditor.jsx';
import MyContracts from './components/whitelabel/myContracts.jsx';
import MinterMarketplace from './components/marketplace/MinterMarketplace.jsx';
import MockUpPage from './components/MockUpPage/MockUpPage';
import MyItems from './components/nft/myItems';
import MyNFTs from './components/nft/myNFT.jsx';

import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import {NftDataCommonLink} from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
import NftDataExternalLink from './components/MockUpPage/NftList/NftData/NftDataExternalLink';
import NotFound from './components/NotFound/NotFound';
import Nutcrackers from './components/SplashPage/Nutcrackers/Nutcrackers';

import { PrivacyPolicy } from './components/SplashPage/PrivacyPolicy';

import { OnboardingButton } from './components/common/OnboardingButton';

import RairProduct from './components/nft/rairCollection.jsx';
//Google Analytics
import ReactGA from 'react-ga';

import SplashPage from './components/SplashPage';
import setTitle from './utils/setTitle';

import ThankYouPage from './components/ThankYouPage';
import Token from './components/nft/Token.jsx';
import { TermsUse } from './components/SplashPage/TermsUse';

import UserProfileSettings from './components/UserProfileSettings/UserProfileSettings';

import VideoPlayer from './components/video/videoPlayer.jsx';

import WorkflowSteps from './components/creatorStudio/workflowSteps.jsx';
import Footer from './components/Footer/Footer.jsx';
import DiamondMarketplace from './components/ConsumerMode/DiamondMarketplace.jsx';

// logos for About Page
import headerLogoWhite from './images/rairTechLogoWhite.png';
import headerLogoBlack from './images/rairTechLogoBlack.png';
import MainLogo from './components/GroupLogos/MainLogo.jsx';

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

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

const SentryRoute = Sentry.withSentryRouting(Route);

const ErrorFallback = () => {
  return <div className="not-found-page">
      <h3><span className="text-404">Sorry!</span></h3>
      <p>An error has ocurred</p>
  </div>
};

function App({ sentryHistory }) {

  const [userData, setUserData] = useState();
  const [adminAccess, setAdminAccess] = useState(null);
  const [startedLogin, setStartedLogin] = useState(false);
  const [loginDone, setLoginDone] = useState(false);
  const [errorAuth, /*setErrorAuth*/] = useState('');
  const [renderBtnConnect, setRenderBtnConnect] = useState(false);
  
  // Redux
  const dispatch = useDispatch();
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

  const connectUserData = useCallback(async () => {
    setStartedLogin(true);
    let currentUser;
    let dispatchStack = [];
    if (window.ethereum) {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      dispatchStack.push({ type: contractTypes.SET_USER_ADDRESS, payload: accounts[0] })
      dispatchStack.push({
        type: contractTypes.SET_CHAIN_ID,
        payload: window.ethereum.chainId?.toLowerCase()
      });
      currentUser = accounts[0];
    } else if (programmaticProvider) {
      dispatchStack.push({ type: contractTypes.SET_USER_ADDRESS, payload: programmaticProvider.address });
      dispatchStack.push({
        type: contractTypes.SET_CHAIN_ID,
        payload: `0x${ programmaticProvider.provider._network.chainId?.toString(16)?.toLowerCase() }`
      });
      currentUser = programmaticProvider.address;
    }

    if (!currentUser && currentUser !== undefined) {
      Swal.fire('Error', 'No user address found', 'error');
      setStartedLogin(false);
      return;
    }

    try {
      // Check if user exists in DB
      const { success, user } = await (await fetch(`/api/users/${ currentUser }`)).json();
      if (!success || !user) {
        // If the user doesn't exist, send a request to register him using a TEMP adminNFT
        console.log('Address is not registered!');
        const userCreation = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify({ publicAddress: currentUser, adminNFT: 'temp' }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('User Created', userCreation);
        setUserData(userCreation);
      } else {
        setUserData(user);
      }

      // Authorize user and get JWT token
      if (adminAccess === null || !localStorage.token || !isTokenValid(localStorage.token)) {
        dispatchStack.push({ type: authTypes.GET_TOKEN_START });
        let token = await getJWT(programmaticProvider, currentUser);

        if (!success) {
          setStartedLogin(false);
          setLoginDone(false);
          dispatchStack.push({ type: userTypes.SET_ADMIN_RIGHTS, payload: false });
          dispatchStack.push({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
          setAdminAccess(false);
          localStorage.setItem('token', token);
        } else {
          const decoded = jsonwebtoken.decode(token);

          setAdminAccess(decoded.adminRights);
          dispatchStack.push({ type: userTypes.SET_ADMIN_RIGHTS, payload: decoded.adminRights });
          dispatchStack.push({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
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
  }, [adminAccess, programmaticProvider, dispatch]);

  const goHome = () => {
    sentryHistory.push(`/`);
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
        dispatch({ type: contractTypes.SET_CHAIN_ID, payload: chainId });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    // setTitle('Welcome');
    if (process.env.NODE_ENV === 'development') {
      window.gotoRouteBackdoor = sentryHistory.push;
      window.adminAccessBackdoor = (boolean) => {
        setAdminAccess(boolean);
        dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: boolean });
      };
    }
  }, [dispatch, sentryHistory.push, setAdminAccess]);

  useEffect(() => {
    btnCheck();
  }, [btnCheck]);

  // const checkToken = useCallback(() => {
  // 	btnCheck()
  // 	const token = localStorage.getItem('token');
  // 	if (!isTokenValid(token)) {
  // 		connectUserData()
  // 		dispatch({ type: authTypes.GET_TOKEN_START });
  // 		dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token })
  // 	}
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
      connectUserData();
      dispatch({ type: authTypes.GET_TOKEN_START });
      dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
    }
  }, [connectUserData, dispatch, token]);

  // useEffect(() => {
  // 	checkToken();
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

  let creatorViewsDisabled = process.env.REACT_APP_DISABLE_CREATOR_VIEWS === 'true';

	return (
	  <Sentry.ErrorBoundary fallback={ErrorFallback}>
      <Router history={sentryHistory}>
				{/* {currentUserAddress === undefined && !window.ethereum && <Redirect to='/' />} */}
				  <>
        		<div
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
        			}}
        			className="App p-0 container-fluid">
						<UserProfileSettings
							errorAuth={errorAuth}
							adminAccess={adminAccess}
							primaryColor={primaryColor}
							currentUserAddress={currentUserAddress}
							loginDone={loginDone}
							setLoginDone={setLoginDone}
						/>
						<div className='row w-100 m-0 p-0'>
							{/* <div className='col-1 d-none d-xl-inline-block' /> */}
							<div className='col-1 rounded'>
								<div className='col-12 pt-2 mb-4' style={{ height: '100px' }}>
									<MainLogo
										goHome={goHome}
										sentryHistory={sentryHistory}
										headerLogoWhite={headerLogoWhite}
										headerLogoBlack={headerLogoBlack}
										headerLogo={headerLogo}
										primaryColor={primaryColor}
									/>
								</div>
								{!loginDone ? <div className='btn-connect-wallet-wrapper'>
									<button disabled={!window.ethereum && !programmaticProvider && !startedLogin}
										className={`btn btn-${primaryColor} btn-connect-wallet`}
										onClick={connectUserData}>
										{startedLogin ? 'Please wait...' : 'Connect Wallet'}
										{/* <img alt='Metamask Logo' src={MetamaskLogo}/> */}
									</button>
									{renderBtnConnect ? <OnboardingButton /> : <> </>}
								</div> : adminAccess === true && !creatorViewsDisabled && [
									{ name: <i className="fas fa-photo-video" />, route: '/all', disabled: !loginDone },
									{ name: <i className="fas fa-key" />, route: '/my-nft' },
									{ name: <i className="fa fa-id-card" aria-hidden="true" />, route: '/new-factory', disabled: !loginDone },
									{ name: <i className="fa fa-shopping-cart" aria-hidden="true" />, route: '/on-sale', disabled: !loginDone },
									{ name: <i className="fa fa-user-secret" aria-hidden="true" />, route: '/admin', disabled: !loginDone },
									{ name: <i className="fas fa-city" />, route: '/factory', disabled: factoryInstance === undefined },
									{ name: <i className="fas fa-shopping-basket" />, route: '/minter', disabled: minterInstance === undefined },
                  { name: <i className="fas fa-gem" />, route: '/diamondMinter', disabled: diamondMarketplaceInstance === undefined },
									{ name: <i className="fas fa-exchange" />, route: '/admin/transferNFTs', disabled: !loginDone }
								].map((item, index) => {
									if (!item.disabled) {
										return <div key={index} className={`col-12 py-3 rounded btn-${primaryColor}`}>
											<NavLink activeClassName={`active-${primaryColor}`} className='py-3' to={item.route} style={{ color: 'inherit', textDecoration: 'none' }}>
												{item.name}
											</NavLink>
										</div>
									}
									return <div key={index}></div>
								})}
							</div>
							<div className='col'>
								<div className='col-12 blockchain-switcher' style={{ height: '10vh' }}>
									{/* {currentUserAddress && `Connected with ${currentUserAddress}!`}<br /> */}
									<Switch>
										<SentryRoute path='/admin' component={BlockChainSwitcher} />
									</Switch>
								</div>
								<div className='col-12 mt-3 row'>
									<Switch>
                      {[
                        // New Creator UI
                        {
                          path: '/creator/deploy',
                          content: <Deploy />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path: '/creator/contracts',
                          content: <Contracts />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path: '/creator/contract/:blockchain/:address/createCollection',
                          content: <ContractDetails />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path:'/creator/contract/:blockchain/:address/listCollections',
                          content: <ListCollections />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path: '/creator/contract/:blockchain/:address/collection/:collectionIndex/',
                          content: <WorkflowSteps {...{ sentryHistory }} />,
                          constraint: loginDone && !creatorViewsDisabled,
                          exact: false
                        },
                        // Old Creator UI (Using the Database)
                        {
                          path: "/new-factory",
                          content: <MyContracts />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path: "/on-sale",
                          content: <MinterMarketplace />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        {
                          path: "/rair/:contract/:product",
                          content: <RairProduct />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        // Old Video Upload view
                        {
                          path: "/admin",
                          content: <FileUpload primaryColor={ primaryColor } textColor={ textColor }/>,
                          constraint: loginDone && !creatorViewsDisabled && adminAccess
                        },
                        // Old Metadata Editor
                        {
                          path: "/metadata/:blockchain/:contract/:product",
                          content: <MetadataEditor />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        // Old MyNFTs (database)
                        {
                          path: "/my-nft",
                          content: <MyNFTs />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        // Old Token Viewer (Database)
                        {
                          path: "/token/:contract/:identifier",
                          content: <Token />,
                          constraint: loginDone && !creatorViewsDisabled
                        },
                        // Classic Blockchain Factory
                        {
                          path: "/factory",
                          content: <CreatorMode />,
                          constraint: loginDone && !creatorViewsDisabled && factoryInstance !== undefined
                        },
                        // Classic Blockchain Minter Marketplace
                        {
                          path: "/minter",
                          content: <ConsumerMode />,
                          constraint: loginDone && !creatorViewsDisabled && minterInstance !== undefined
                        },
                        // Diamond Marketplace
                        {
                          path: '/diamondMinter',
                          content: <DiamondMarketplace />,
                          constraint: loginDone && !creatorViewsDisabled && diamondMarketplaceInstance !== undefined
                        },
                        {
                          path: '/admin/transferNFTs',
                          content: <TransferTokens />,
                          constraint: loginDone && !creatorViewsDisabled
                        }

                        

                        /*
                        */
                      ].map((item, index) => {
                        if (item.constraint !== undefined && !item.constraint) {
                          return;
                        }
                        return <SentryRoute
                          exact={item.exact !== undefined ? item.exact : true}
                          path={item.path}
                          render={() => item.content} />
                      })}
										<SentryRoute exact path="/about-page">
											<AboutPageNew
												primaryColor={primaryColor}
												headerLogoWhite={headerLogoWhite}
												headerLogoBlack={headerLogoBlack}
											/>
										</SentryRoute>
                    <SentryRoute exact path='/'>
                      <div className='col-6 text-left'>
                        <h1 className='w-100' style={{ textAlign: 'left' }}>
                          Digital <b className='title'>Ownership</b>
                          <br />
                          Encryption
                        </h1>
                        <p className='w-100' style={{ textAlign: 'left' }}>
                          RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content
                        </p>
                      </div>
                      <div className='col-12 mt-3 row' >
                        <MockUpPage primaryColor={primaryColor} textColor={textColor} />
                      </div>
                    </SentryRoute>
                    <SentryRoute path='/all'>
                      <MockUpPage primaryColor={primaryColor} textColor={textColor} />
                    </SentryRoute>
                    {loginDone && <SentryRoute exact path="/my-items"> 
                      <MyItems goHome={ goHome }/>
                    </SentryRoute> }
										
										<SentryRoute exact path='/:adminToken/:blockchain/:contract/:product/:offer/:token'>
											<NftDataExternalLink currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>
										<SentryRoute exact path="/coming-soon" component={ComingSoon} />
										<SentryRoute exact path="/coming-soon-nutcrackers" component={ComingSoonNut} />

                    {/*
                      Iterate over any splash page and add the connect user data function
                    */}
                    {
                      [
                        {
                          route: '/immersiverse-splash',
                          component: ImmersiVerseSplashPage
                        },
                        {
                          route: '/greyman-splash',
                          component: GreymanSplashPage
                        },
                        {
                          route: '/nutcrackers-splash',
                          component: Nutcrackers
                        },
                        {
                          route: '/nipsey-splash',
                          component: SplashPage
                        },
                      ].map((item, index) => {
                        return <SentryRoute exact path={item.route}>
                          <item.component {...{connectUserData}}/>
                        </SentryRoute>
                      })
                    }
                    
										<SentryRoute exact path="/privacy" component={PrivacyPolicy} />

										<SentryRoute exact path="/terms-use" component={TermsUse} />
										<SentryRoute exact path="/thankyou" component={ThankYouPage} />

										<SentryRoute exact path='/:tokens/:blockchain/:contract/:product/:tokenId'>
											<NftDataCommonLink userData={userData} currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>

										<SentryRoute exact path='/:collection/:blockchain/:contract/:product/:tokenId'>
											<NftDataCommonLink  userData={userData} currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>

										<SentryRoute exact path='/:unlockables/:blockchain/:contract/:product/:tokenId'>
											<NftDataCommonLink  userData={userData} currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>

										<SentryRoute exact path="/notifications" component={ NotificationPage }/>

										<SentryRoute path="/watch/:videoId/:mainManifest" component={ VideoPlayer }/>
										<SentryRoute path="" component={NotFound} />
									</Switch>
								</div>
							</div>
						</div>
						{/* <div className='py-5' /> */}
		        </div>
						<Footer sentryHistory={sentryHistory} openAboutPage={openAboutPage} primaryColor={primaryColor} />
					</>
				</Router>
			</Sentry.ErrorBoundary>
	);
}

export default App;
