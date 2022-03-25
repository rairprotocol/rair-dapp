import { useState, useEffect, useCallback } from 'react';
import { Router, Switch, Route, /*Redirect*/ NavLink, useLocation } from 'react-router-dom';
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
import { NftDataCommonLink } from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
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
import { detectBlockchain } from './utils/blockchainData.js';
import AlertMetamask from './components/AlertMetamask/index.jsx';
import NFTLASplashPage from './components/SplashPage/NFTLASplashPage.jsx';
import MenuNavigation from './components/Navigation/Menu.jsx';
import UkraineSplashPage from './components/SplashPage/UkraineGlitchSplashPage/UkraineSplashPage.jsx';

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
	const [adminAccess, setAdminAccess] = useState(null);
	const [startedLogin, setStartedLogin] = useState(false);
	const [loginDone, setLoginDone] = useState(false);
	const [errorAuth, /*setErrorAuth*/] = useState('');
	const [renderBtnConnect, setRenderBtnConnect] = useState(false);
	const [showAlert, setShowAlert] = useState(true);
	const { currentChain, realChain } = useSelector(store => store.contractStore);
	const { selectedChain, realNameChain } = detectBlockchain(currentChain, realChain);

	const carousel_match = window.matchMedia('(min-width: 600px)')
	const [carousel, setCarousel] = useState(carousel_match.matches)
	window.addEventListener("resize", () => setCarousel(carousel_match.matches))

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
				payload: `0x${programmaticProvider.provider._network.chainId?.toString(16)?.toLowerCase()}`
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
			const { success, user } = await (await fetch(`/api/users/${currentUser}`)).json();
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
		setShowAlert(false)
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
			connectUserData();
			dispatch({ type: authTypes.GET_TOKEN_START });
			dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token });
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
					{carousel && <UserProfileSettings
						errorAuth={errorAuth}
						adminAccess={adminAccess}
						primaryColor={primaryColor}
						currentUserAddress={currentUserAddress}
						loginDone={loginDone}
						setLoginDone={setLoginDone}
					/>}
					<div className='row w-100 m-0 p-0'>
						{/*
							Left sidebar, includes the RAIR logo and the admin sidebar
						*/}
						{carousel ? <div className='col-1 rounded'>
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
							{!loginDone ?
								<div className='btn-connect-wallet-wrapper'>
									<button disabled={!window.ethereum && !programmaticProvider && !startedLogin}
										className={`btn btn-${primaryColor} btn-connect-wallet`}
										onClick={connectUserData}>
										{startedLogin ? 'Please wait...' : 'Connect Wallet'}
										{/* <img alt='Metamask Logo' src={MetamaskLogo}/> */}
									</button>
									{renderBtnConnect ?
										<OnboardingButton />
										:
										<></>
									}
								</div>
								:
								adminAccess === true && !creatorViewsDisabled && [
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
								})
							}
						</div> : <MenuNavigation
							primaryColor={primaryColor}
							headerLogo={headerLogo}
							programmaticProvider={programmaticProvider}
							startedLogin={startedLogin}
							connectUserData={connectUserData}
							renderBtnConnect={renderBtnConnect}
							loginDone={loginDone}
							setLoginDone={setLoginDone}
						/>
						}

						{/*
							Main body, the header, router and footer are here
						*/}
						<div className='col'>
							<div className='col-12 blockchain-switcher' style={{ height: '10vh' }}>
								<Switch>
									<SentryRoute path='/admin' component={BlockChainSwitcher} />
								</Switch>
							</div>
							<div className='col-12 mt-3 row'>
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
												path: '/nftla-splash',
												content: NFTLASplashPage
											},
											{
												path: '/ukraineglitch',
												content: UkraineSplashPage
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
										].map((item, index) => {
											// If the path is set as the Home Page, render it as the default path (/)
											let isHome = item.path === process.env.REACT_APP_HOME_PAGE;

											if (process.env.REACT_APP_HOME_PAGE !== '/' && !isHome) {
												return undefined;
											}

											return <SentryRoute key={index} exact path={isHome ? '/' : item.path}>
												<item.content {...{ connectUserData }} />
											</SentryRoute>
										})
									}
									{[

										/*
											If the home page isn't the default '/', it won't show the
												'Digital Ownership Encryption' message
										*/
										{
											path: '/',
											content: <>
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
													<MockUpPage />
												</div>
											</>,
											requirement: process.env.REACT_APP_HOME_PAGE === '/',
										},

										// Creator UI - New Views based on Figma
										{
											path: '/creator/deploy',
											content: <Deploy />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: '/creator/contracts',
											content: <Contracts />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: '/creator/contract/:blockchain/:address/createCollection',
											content: <ContractDetails />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: '/creator/contract/:blockchain/:address/listCollections',
											content: <ListCollections />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: '/creator/contract/:blockchain/:address/collection/:collectionIndex/',
											content: <WorkflowSteps {...{ sentryHistory }} />,
											requirement: loginDone && !creatorViewsDisabled,
											exact: false
										},

										// Old Creator UI (Using the Database)
										{
											path: "/new-factory",
											content: <MyContracts />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: "/on-sale",
											content: <MinterMarketplace />,
											requirement: loginDone && !creatorViewsDisabled
										},
										{
											path: "/rair/:contract/:product",
											content: <RairProduct />,
											requirement: loginDone && !creatorViewsDisabled
										},

										// Old Video Upload view
										{
											path: "/admin",
											content: <FileUpload primaryColor={primaryColor} textColor={textColor} />,
											requirement: loginDone && !creatorViewsDisabled && adminAccess
										},

										// Old Metadata Editor
										{
											path: "/metadata/:blockchain/:contract/:product",
											content: <MetadataEditor />,
											requirement: loginDone && !creatorViewsDisabled
										},

										// Old MyNFTs (Using the database)
										{
											path: "/my-nft",
											content: <MyNFTs />,
											requirement: loginDone && !creatorViewsDisabled
										},

										// Old Token Viewer (Using the database)
										{
											path: "/token/:contract/:identifier",
											content: <Token />,
											requirement: loginDone && !creatorViewsDisabled
										},

										// Classic Factory (Uses the blockchain)
										{
											path: "/factory",
											content: <CreatorMode />,
											requirement: loginDone && !creatorViewsDisabled && factoryInstance !== undefined
										},

										// Classic Minter Marketplace (Uses the blockchain)
										{
											path: "/minter",
											content: <ConsumerMode />,
											requirement: loginDone && !creatorViewsDisabled && minterInstance !== undefined
										},

										// Diamond Marketplace (Uses the blockchain)
										{
											path: '/diamondMinter',
											content: <DiamondMarketplace />,
											requirement: loginDone && !creatorViewsDisabled && diamondMarketplaceInstance !== undefined
										},
										{
											path: '/admin/transferNFTs',
											content: <TransferTokens />,
											constraint: loginDone && !creatorViewsDisabled
										},
										{
											path: '/about-page',
											content: <AboutPageNew
												connectUserData={connectUserData}
												headerLogoWhite={headerLogoWhite}
												headerLogoBlack={headerLogoBlack}
											/>
										},

										/*
											Public Facing Routes
										*/
										{
											path: '/all',
											content: <MockUpPage />,
										},
										{
											path: '/my-items',
											content: <MyItems goHome={goHome} />,
											requirement: loginDone
										},
										{
											path: '/:adminToken/:blockchain/:contract/:product/:offer/:token',
											content: <NftDataExternalLink currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />,
										},
										{
											path: '/coming-soon',
											content: <ComingSoon />,
										},
										{
											path: '/coming-soon-nutcrackers',
											content: <ComingSoonNut />,
										},
										{
											path: '/privacy',
											content: <PrivacyPolicy />,
										},
										{
											path: '/terms-use',
											content: <TermsUse />,
										},
										{
											path: '/thankyou',
											content: <ThankYouPage />,
										},

										/*
											3 Tab Marketplace?
										*/
										{
											path: '/:tokens/:blockchain/:contract/:product/:tokenId',
											content: <NftDataCommonLink
												userData={userData}
											/>,
											requirement: process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !== 'true'
										},
										{
											path: '/:collection/:blockchain/:contract/:product/:tokenId',
											content: <NftDataCommonLink
												userData={userData}
											/>,
											requirement: process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !== 'true'
										},
										{
											path: '/:unlockables/:blockchain/:contract/:product/:tokenId',
											content: <NftDataCommonLink
												userData={userData}
											/>,
											requirement: process.env.REACT_APP_3_TAB_MARKETPLACE_DISABLED !== 'true'
										},

										{
											path: '/notifications',
											content: <NotificationPage />
										},
										// Video Player
										{
											path: '/watch/:videoId/:mainManifest',
											content: <VideoPlayer />,
											exact: false
										},

										// Default route, leave this at the bottom always
										{
											path: '',
											content: <NotFound />,
											exact: false
										}
									].map((item, index) => {
										// If the requirements for the route aren't met, it won't return anything
										if (item.requirement !== undefined && !item.requirement) {
											return;
										}
										return <SentryRoute
											key={index}
											exact={item.exact !== undefined ? item.exact : true}
											path={item.path}
											render={() => item.content}
										/>
									})}
								</Switch>
							</div>
						</div>
					</div>
				</div>
				<Footer sentryHistory={sentryHistory} openAboutPage={openAboutPage} primaryColor={primaryColor} />
			</Router>
		</Sentry.ErrorBoundary>
	);
}

export default App;
