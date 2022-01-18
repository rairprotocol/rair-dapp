import { useState, useEffect, useCallback } from 'react';
import { Router, Switch, Route, /*Redirect*/ NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJWT, isTokenValid } from './utils/rFetch.js';

import './App.css';

// React Redux types
import * as contractTypes from './ducks/contracts/types.js';
import * as userTypes from './ducks/users/types.js';
import * as authTypes from './ducks/auth/types.js';
import * as Sentry from "@sentry/react";
import * as ethers from 'ethers'
// import * as colorTypes from './ducks/colors/types.js';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

import jsonwebtoken from 'jsonwebtoken';

//import CSVParser from './components/metadata/csvParser.jsx';
import AboutPageNew from './components/AboutPage/AboutPageNew/AboutPageNew';

import BlockChainSwitcher from './components/adminViews/BlockchainSwitcher.jsx';

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

import ListCollections from './components/creatorStudio/ListCollections.jsx';

import MetadataEditor from './components/metadata/metadataEditor.jsx';
import MyContracts from './components/whitelabel/myContracts.jsx';
import MinterMarketplace from './components/marketplace/MinterMarketplace.jsx';
import MockUpPage from './components/MockUpPage/MockUpPage';
import MyItems from './components/nft/myItems';
import MyNFTs from './components/nft/myNFT.jsx';

import NotificationPage from './components/UserProfileSettings/NotificationPage/NotificationPage';
import NftDataCommonLink from './components/MockUpPage/NftList/NftData/NftDataCommonLink';
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

import DiamondDeploymentUI from './components/Diamonds/diamondDeploymentUI.jsx';

import WorkflowSteps from './components/creatorStudio/workflowSteps.jsx';
const SentryRoute = Sentry.withSentryRouting(Route);

const ErrorFallback = () => {
	return <div className='bg-stiromol'>
		<h1> Whoops! </h1>
		An error has ocurred
	</div>
}

function App({ sentryHistory }) {

	const [/*userData*/, setUserData] = useState();
	const [adminAccess, setAdminAccess] = useState(undefined);
	const [startedLogin, setStartedLogin] = useState(false);
	const [loginDone, setLoginDone] = useState(false);
	const [errorAuth, /*setErrorAuth*/] = useState('');
	const [renderBtnConnect, setRenderBtnConnect] = useState(false)

	// Google Analytics
	const TRACKING_ID = "UA-209450870-3"; // YOUR_OWN_TRACKING_ID
	ReactGA.initialize(TRACKING_ID);
	// Redux
	const dispatch = useDispatch()
	const { currentUserAddress, minterInstance, factoryInstance, programmaticProvider, diamondFactoryInstance } = useSelector(store => store.contractStore);
	const { primaryColor, headerLogo, textColor, backgroundImage, backgroundImageEffect } = useSelector(store => store.colorStore);
	const { token } = useSelector(store => store.accessStore);

	const connectUserData = useCallback(async () => {
		setStartedLogin(true);
		let currentUser;
		if (window.ethereum) {
			let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
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
				})
				console.log('User Created', userCreation);
				setUserData(userCreation);
			} else {
				setUserData(user);
			}

			// Admin rights validation
			// let adminRights = adminAccess;
			if (adminAccess === undefined) {
				const { response } = await (await fetch(`/api/auth/get_challenge/${currentUser}`)).json();
				let ethResponse;
				let ethRequest = {
					method: 'eth_signTypedData_v4',
					params: [currentUser, response],
					from: currentUser
				}
				if (window.ethereum) {
					ethResponse = await window.ethereum.request(ethRequest);
				} else if (programmaticProvider) {
					let parsedResponse = JSON.parse(response);
					// EIP712Domain is added automatically by Ethers.js!
					let { EIP712Domain, ...revisedTypes } = parsedResponse.types;
					ethResponse = await programmaticProvider._signTypedData(
						parsedResponse.domain,
						revisedTypes,
						parsedResponse.message);
				} else {
					Swal.fire('Error', "Can't sign messages", 'error');
					console.log("Nahuy")
					return;
				}
				const adminResponse = await (await fetch(`/api/auth/admin/${JSON.parse(response).message.challenge}/${ethResponse}/`)).json();
				dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: adminResponse.success });
				setAdminAccess(adminResponse.success);
				// adminRights = adminResponse.success;
			}

			let signer = programmaticProvider;

			if (window.ethereum) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				signer = provider.getSigner();
			}

			if (!localStorage.token) {
				let token = await getJWT(signer, user, currentUser);
				if (!success) {
					setLoginDone(false);
					setStartedLogin(false);
				}
				dispatch({ type: authTypes.GET_TOKEN_START });
				dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token })
				localStorage.setItem('token', token);
			}

			if (!isTokenValid(localStorage.token)) {
				let token = await getJWT(signer, user, currentUser);
				if (!success) {
					setLoginDone(false);
					setStartedLogin(false);
				}
				dispatch({ type: authTypes.GET_TOKEN_START });
				dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token })
				// dispatch({ type: authTypes.GET_TOKEN_ERROR, payload: null })
				localStorage.setItem('token', token);
			}

			setStartedLogin(false);
			setLoginDone(true);
		} catch (err) {
			console.log("Error", err)
			setStartedLogin(false);
		}
	}, [adminAccess, programmaticProvider, dispatch]);

	const goHome = () => {
		sentryHistory.push(`/`)
	}

	const openAboutPage = () => {
		sentryHistory.push(`/about-page`)
		window.scrollTo(0, 0);
	}

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
	}, [dispatch])

	useEffect(() => {
		setTitle('Welcome');
		if (process.env.NODE_ENV === 'development') {
			window.gotoRouteBackdoor = sentryHistory.push
			window.adminAccessBackdoor = (boolean) => {
				setAdminAccess(boolean);
				dispatch({ type: userTypes.SET_ADMIN_RIGHTS, payload: boolean });
			}
		}
	}, [dispatch, sentryHistory.push])

	useEffect(() => {
		btnCheck()
	}, [btnCheck])

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
					connectUserData()
				}, decoded.exp * 1000)
			}
		}
		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		}
	}, [token, connectUserData])

	useEffect(() => {
		if (localStorage.token && isTokenValid(localStorage.token)) {
			connectUserData()
			dispatch({ type: authTypes.GET_TOKEN_START });
			dispatch({ type: authTypes.GET_TOKEN_COMPLETE, payload: token })
		}
	}, [connectUserData, dispatch, token])

	// useEffect(() => {
	// 	checkToken();
	// }, [checkToken, token])

	useEffect(() => {
		if (primaryColor === "charcoal") {
			(function () {
				let angle = 0;
				let p = document.querySelector("p");
				if (p) {
					let text = p.textContent.split("");
					var len = text.length;
					var phaseJump = 360 / len;
					var spans;
					p.innerHTML = text
						.map(function (char) {
							return "<span>" + char + "</span>";
						})
						.join("");

					spans = p.children;
				} else console.log("kik");

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
							"hsl(" + (angle + Math.floor(i * phaseJump)) + ", 55%, 70%)";
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
				<div
					style={{
						...backgroundImageEffect,
						backgroundSize: '100vw 100vh',
						minHeight: '100vh',
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
					<div className='row w-100 m-0 p-0' style={{position: "relative"}}>
						<div className='col-1 d-none d-xl-inline-block' />
						<div className='col-1 rounded'>
							<div className='col-12 pt-2 mb-4' style={{ height: '100px' }}>
								<img onClick={() => goHome()} alt='Header Logo' src={headerLogo} className='h-100 header_logo' />
							</div>
							{!loginDone ? <div className='btn-connect-wallet-wrapper'>
								<button disabled={!window.ethereum && !programmaticProvider && !startedLogin}
									className={`btn btn-${primaryColor} btn-connect-wallet`}
									onClick={connectUserData}>
									{startedLogin ? 'Please wait...' : 'Connect Wallet'}
									{/* <img alt='Metamask Logo' src={MetamaskLogo}/> */}
								</button>
								{renderBtnConnect ? <OnboardingButton /> : <> </>}
							</div> : adminAccess === true && [
								{ name: <i className="fas fa-photo-video" />, route: '/all', disabled: !loginDone },
								{ name: <i className="fas fa-key" />, route: '/my-nft' },
								{ name: <i className="fa fa-id-card" aria-hidden="true" />, route: '/new-factory', disabled: !loginDone },
								{ name: <i className="fa fa-shopping-cart" aria-hidden="true" />, route: '/on-sale', disabled: !loginDone },
								{ name: <i className="fa fa-user-secret" aria-hidden="true" />, route: '/admin', disabled: !loginDone },
								{ name: <i className="fas fa-city" />, route: '/factory', disabled: factoryInstance === undefined },
								{ name: <i className="fas fa-shopping-basket" />, route: '/minter', disabled: minterInstance === undefined },
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
									{loginDone && <SentryRoute path='/creator/deploy' component={Deploy} />}
									{loginDone && <SentryRoute path='/creator/contracts' component={Contracts} />}
									{loginDone && <SentryRoute path='/creator/contract/diamond/:blockchain/:address/' component={DiamondDeploymentUI} />}
									{loginDone && <SentryRoute path='/creator/contract/:blockchain/:address/createCollection' component={ContractDetails} />}
									{loginDone && <SentryRoute path='/creator/contract/:blockchain/:address/listCollections' component={ListCollections} />}
									{loginDone && <SentryRoute path='/creator/contract/:blockchain/:address/collection/:collectionIndex/'>
										<WorkflowSteps {...{ sentryHistory }} />
									</SentryRoute>}
									<SentryRoute exact path="/about-page">
										<AboutPageNew primaryColor={primaryColor}/>
									</SentryRoute>
									<SentryRoute path='/all'>
										<MockUpPage primaryColor={primaryColor} textColor={textColor} />
									</SentryRoute>
									<SentryRoute path='/:adminToken/:blockchain/:contract/:product/:offer/:token'>
										<NftDataExternalLink currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
									</SentryRoute>

									<SentryRoute path="/coming-soon" component={ComingSoon} />
									<SentryRoute path="/coming-soon-nutcrackers" component={ComingSoonNut} />

									<SentryRoute exact path="/greyman-splash" component={GreymanSplashPage} />

									<SentryRoute exact path="/privacy" component={PrivacyPolicy} />

									<SentryRoute exact path="/terms-use" component={TermsUse} />
									<SentryRoute exact path="/thankyou" component={ThankYouPage} />
									<SentryRoute exact path='/tokens/:blockchain/:contract/:product/:tokenId'>
										<NftDataCommonLink currentUser={currentUserAddress} primaryColor={primaryColor} textColor={textColor} />
									</SentryRoute>

									<SentryRoute exact path="/nipsey-splash" component={SplashPage} />
									<SentryRoute exact path="/nutcrackers-splash" component={Nutcrackers} />
									<SentryRoute exact path="/notifications" component={NotificationPage} />
									
									<SentryRoute path='/watch/:videoId/:mainManifest' component={VideoPlayer} />
									
									{adminAccess && <SentryRoute path='/admin'>
										<FileUpload primaryColor={primaryColor} textColor={textColor} />
									</SentryRoute>}
									{factoryInstance && <SentryRoute exact path='/factory' component={CreatorMode} />}
									{loginDone && <SentryRoute path='/token/:contract/:identifier' component={Token} />}
									{minterInstance && <SentryRoute exact path='/minter' component={ConsumerMode} />}
									{loginDone && <SentryRoute exact path='/metadata/:blockchain/:contract/:product' component={MetadataEditor} />}
									{loginDone && <SentryRoute exact path='/my-nft' component={MyNFTs} />}
									{loginDone && <SentryRoute exact path='/my-items' >
										<MyItems goHome={goHome} />
									</SentryRoute>}
									{loginDone && <SentryRoute path='/new-factory' component={MyContracts} />}
									{loginDone && <SentryRoute path='/on-sale' component={MinterMarketplace} />}
									{loginDone && <SentryRoute path='/rair/:contract/:product' component={RairProduct} />}
									
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
					<div className='py-5' />
						<footer
							className="footer col"
							style={{
								background: `${primaryColor === "rhyno" ? "#ccc" : ""}`
							}}
						>
							<div className="text-rairtech" style={{ color: `${primaryColor === "rhyno" ? "#000" : ""}` }}>
								© Rairtech 2021. All rights reserved
							</div>
							<ul>
								<li>
									<a href="https://tech.us16.list-manage.com/subscribe/post?u=4740c76c171ce33ffa0edd3e6&id=1f95f6ad8c" rel="noreferrer" target="_blank">Newsletter</a>
								</li>
								<li>
									<a target="_blank" rel="noreferrer" href="https://etherscan.io/error.html?404">Contract</a>
								</li>
								<li>
									<a href="https://discord.gg/7KaSHNJ7qS" rel="noreferrer" target="_blank">Inquiries</a>
								</li>
								<li>
									<NavLink to="/terms-use">Terms of Service</NavLink>
								</li>
								<li onClick={() => openAboutPage()}>About us</li>
							</ul>
						</footer>
				</div>
			</Router>
		</Sentry.ErrorBoundary>
	);
}
export default App;
