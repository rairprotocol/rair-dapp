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

import ComingSoon from './components/SplashPage/CommingSoon/CommingSoon';
import ComingSoonNut from './components/SplashPage/CommingSoon/ComingSoonNut';

// import Footer from './components/Footer/Footer';

import GreymanSplashPage from './components/SplashPage/GreymanSplashPage';

import MetadataEditor from './components/metadata/metadataEditor.jsx';
import MyContracts from './components/whitelabel/myContracts.jsx';
import MockUpPage from './components/MockUpPage/MockUpPage';
import MyItems from './components/nft/myItems';
import MyNFTs from './components/nft/myNFT.jsx';

import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import { NftDataCommonLink } from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
import NftDataExternalLink from './components/MockUpPage/NftList/NftData/NftDataExternalLink';
import NotFound from './components/NotFound/NotFound';
import Nutcrackers from './components/SplashPage/Nutcrackers/Nutcrackers';

import { PrivacyPolicy } from './components/SplashPage/PrivacyPolicy';
import { OnboardingButton } from './components/common/OnboardingButton';

//Google Analytics
import ReactGA from 'react-ga';

import SplashPage from './components/SplashPage';
import setTitle from './utils/setTitle';

import ThankYouPage from './components/ThankYouPage';
import Token from './components/nft/Token.jsx';
import { TermsUse } from './components/SplashPage/TermsUse';

import UserProfileSettings from './components/UserProfileSettings/UserProfileSettings';

import VideoPlayer from './components/video/videoPlayer.jsx';

import Footer from './components/Footer/Footer.jsx';

// logos for About Page
import headerLogoWhite from './images/rairTechLogoWhite.png';
import headerLogoBlack from './images/rairTechLogoBlack.png';
import MainLogo from './components/GroupLogos/MainLogo.jsx';
import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'


const analytics = Analytics({
  app: 'greyman',
  plugins: [
    googleAnalytics({
      trackingId: 'UA-209450870-5'
    })
  ]
})
/* Track a page view */
analytics.page()

const SentryRoute = Sentry.withSentryRouting(Route);

const ErrorFallback = () => {
  return <div className="bg-stiromol">
    <h1> Whoops! </h1>
    An error has ocurred
  </div>;
};

function App({ sentryHistory }) {

  const [/*userData*/, setUserData] = useState();
  const [adminAccess, setAdminAccess] = useState(null);
  const [startedLogin, setStartedLogin] = useState(false);
  const [loginDone, setLoginDone] = useState(false);
  const [errorAuth, /*setErrorAuth*/] = useState('');
  const [renderBtnConnect, setRenderBtnConnect] = useState(false);



  // Redux
  const dispatch = useDispatch();
  const {
    currentUserAddress,
    programmaticProvider,
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
    if (window.ethereum) {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      dispatch({ type: contractTypes.SET_USER_ADDRESS, payload: accounts[0] });
      dispatch({
        type: contractTypes.SET_CHAIN_ID,
        payload: window.ethereum.chainId?.toLowerCase()
      });
      currentUser = accounts[0];
    } else if (programmaticProvider) {
      dispatch({ type: contractTypes.SET_USER_ADDRESS, payload: programmaticProvider.address });
      dispatch({
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
        dispatch({ type: authTypes.GET_TOKEN_START });
        let token = await getJWT(programmaticProvider, currentUser);

        if (!success) {
          setStartedLogin(false);
          setLoginDone(false);
          dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: false });
          dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
          setAdminAccess(false);
          localStorage.setItem('token', token);
        } else {
          const decoded = jsonwebtoken.decode(token);

          setAdminAccess(decoded.adminRights);
          dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: decoded.adminRights });
          dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
          localStorage.setItem('token', token);
        }
      }

      setStartedLogin(false);
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
    setTitle('#Cryptogreyman');
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
                </div> : <></>}
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
										<SentryRoute exact path="/about-page">
											<AboutPageNew
												primaryColor={primaryColor}
												headerLogoWhite={headerLogoWhite}
												headerLogoBlack={headerLogoBlack}
											/>
										</SentryRoute>
										<SentryRoute path='/all'>
											<MockUpPage primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>
										<SentryRoute path='/:adminToken/:blockchain/:contract/:product/:offer/:token'>
											<NftDataExternalLink currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
										</SentryRoute>

                    <SentryRoute path="/coming-soon" component={ ComingSoon }/>
                    <SentryRoute path="/coming-soon-nutcrackers" component={ ComingSoonNut }/>

										<SentryRoute exact path="/" component={GreymanSplashPage} />

										<SentryRoute exact path="/privacy" component={PrivacyPolicy} />

                    <SentryRoute exact path="/terms-use" component={ TermsUse }/>
                    <SentryRoute exact path="/thankyou" component={ ThankYouPage }/>
                    <SentryRoute exact path="/tokens/:blockchain/:contract/:product/:tokenId">
                      <NftDataCommonLink currentUser={ currentUserAddress } primaryColor={ primaryColor }
                                         textColor={ textColor }/>
                    </SentryRoute>

                    <SentryRoute exact path="/nipsey-splash" component={ SplashPage }/>
                    <SentryRoute exact path="/nutcrackers-splash" component={ Nutcrackers }/>
                    <SentryRoute exact path="/notifications" component={ NotificationPage }/>

                    <SentryRoute path="/watch/:videoId/:mainManifest" component={ VideoPlayer }/>

                    { loginDone && <SentryRoute path="/token/:contract/:identifier" component={ Token }/> }
                    { loginDone && <SentryRoute exact path="/metadata/:blockchain/:contract/:product"
                                                component={ MetadataEditor }/> }
                    { loginDone && <SentryRoute exact path="/my-items">
                      <MyItems goHome={ goHome }/>
                    </SentryRoute> }
                    { loginDone && <SentryRoute path="/new-factory" component={ MyContracts }/> }

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
