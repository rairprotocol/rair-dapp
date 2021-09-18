import { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import * as ethers from 'ethers'

// React Redux types
import * as contractTypes from './ducks/contracts/types.js';
import * as colorTypes from './ducks/colors/types.js';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

import CSVParser from './components/metadata/csvParser.jsx';
import MetadataEditor from './components/metadata/metadataEditor.jsx';
import CreateBatchMetadata from './components/metadata/CreateBatchMetadata.jsx';
import BlockChainSwitcher from './components/adminViews/BlockchainSwitcher.jsx';

import MyContracts from './components/whitelabel/myContracts.jsx';

import CreatorMode from './components/creatorMode.jsx';
import ConsumerMode from './components/consumerMode.jsx';

import VideoList from './components/video/videoList.jsx';
import VideoPlayer from './components/video/videoPlayer.jsx';
import FileUpload from './components/video/videoUpload.jsx';

import MyNFTs from './components/nft/myNFT.jsx';
import Token from './components/nft/Token.jsx';
import RairProduct from './components/nft/rairCollection.jsx';

import MetamaskLogo from './images/metamask-fox.svg';

function App() {

	const [/*userData*/, setUserData] = useState();
	const [adminAccess, setAdminAccess] = useState(undefined);

	// Redux
	const dispatch = useDispatch()
	const {currentUserAddress, minterInstance, factoryInstance} = useSelector(store => store.contractStore);
	const {primaryColor, headerLogo, textColor, backgroundImage, backgroundImageEffect} = useSelector(store => store.colorStore);

	const connectUserData = async () => {
		let currentUser;
		if (window.ethereum) {
			let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
			dispatch({type: contractTypes.SET_USER_ADDRESS, payload: accounts[0]});
			dispatch({
				type: contractTypes.SET_CHAIN_ID,
				payload: window.ethereum.chainId?.toLowerCase()
			});
			currentUser = accounts[0];
		}

		if (!currentUser) {
			Swal.fire('Error', 'No user address found', 'error');
		}

		try {
			// Check if user exists in DB
			const {success, user} = await (await fetch(`/api/users/${currentUser}`)).json();
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
			let adminRights = adminAccess;
			if (adminAccess === undefined) {
				const { response } = await (await fetch(`/api/auth/get_challenge/${currentUser}`)).json();
				const ethResponse = await window.ethereum.request({
					method: 'eth_signTypedData_v4',
					params: [currentUser, response],
					from: currentUser
				});
				const adminResponse = await (await fetch(`/api/auth/admin/${ JSON.parse(response).message.challenge }/${ ethResponse }/`)).json();
				setAdminAccess(adminResponse.success);
				adminRights = adminResponse.success;
			}

			if (!localStorage.token) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
					const msg = `Sign in for RAIR by nonce: ${ user.nonce }`;
					let signer = provider.getSigner();
					let signature = await (signer.signMessage(msg, currentUser));
					const { token } = await (await fetch('/api/auth/authentication', {
					method: 'POST',
					body: JSON.stringify({ publicAddress: currentUser, signature, adminRights: adminRights }),
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						}
					})
				).json();
				localStorage.setItem('token', token);
			}
		} catch (err) {
			console.log('Error', err)
		}
	};

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('chainChanged', async (chainId) => {
				dispatch({type: contractTypes.SET_CHAIN_ID, payload: chainId});
			});
		}
	}, [dispatch])

	return (
		<BrowserRouter>
			{currentUserAddress === undefined && !window.ethereum && <Redirect to='/admin' />}
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
				<div style={{position: 'absolute', top: '1rem', right: '1rem'}}>
					<button style={{color: 'var(--royal-purple)', border: 'solid 1px var(--royal-purple)', backgroundColor: 'inherit', borderRadius: '50%'}} onClick={e => {
						dispatch({type: colorTypes.SET_COLOR_SCHEME, payload: primaryColor === 'rhyno' ? 'charcoal' : 'rhyno'});
					}}>
						{primaryColor === 'rhyno' ? <i className='far fa-moon' /> : <i className='far fa-sun' />}
					</button>
				</div>
				<div className='row w-100 m-0 p-0'>
					<div className='col-1 d-none d-xl-inline-block' />
					<div className='col-1 rounded'>
						<div className='col-12 pt-2 mb-4' style={{height: '10vh'}}>
							<img alt='Header Logo' src={headerLogo} className='h-100'/>
						</div>
						{(currentUserAddress === undefined) ? <button disabled={!window.ethereum} className={`btn btn-${primaryColor}`} onClick={connectUserData}>
							Connect Wallet <img alt='Metamask Logo' src={MetamaskLogo} />
						</button> : [
							{name: <i className='fas fa-search' />, route: '/search'},
							{name: <i className='fas fa-user' />, route: '/user'},
							{name: 'My NFTs', route: '/my-nft'},
							{name: 'My Contracts', route: '/new-factory'},
							{name: 'For Sale', route: '/on-sale'},
							{name: 'Admin', route: '/admin'},
							{name: 'All', route: '/all'},
							{name: 'Latest', route: '/latest'},
							{name: 'Hot', route: '/hot'},
							{name: 'Ending', route: '/ending'},
							{name: 'Factory', route: '/factory', disabled: factoryInstance === undefined},
							{name: 'Minter Marketplace', route: '/minter', disabled: minterInstance === undefined}
						].map((item, index) => {
							if (!item.disabled) {
								return <div key={index} className={`col-12 py-3 rounded btn-${primaryColor}`}>
									<Link className='py-3' to={item.route} style={{color: 'inherit', textDecoration: 'none'}}>
										{item.name}
									</Link>
								</div>
							}
							return <div key={index}></div>
						})}
					</div>
					<div className='col'>
						<div className='col-12' style={{height: '10vh'}}>
							{currentUserAddress && `Connected with ${currentUserAddress}!`}<br />
							<Switch>
								<Route path='/admin' component={BlockChainSwitcher} />
							</Switch>
						</div>
						<div className='col-12 mt-3 row'>
							<Switch>
								{factoryInstance && <Route exact path='/factory' component={CreatorMode} />}
								{minterInstance && <Route exact path='/minter' component={ConsumerMode} />}
								<Route exact path='/metadata/:contract/:product' component={MetadataEditor} />
								<Route path='/batch-metadata/:contract/:product' component={CreateBatchMetadata} />
								<Route path='/my-nft'>
									<MyNFTs />
								</Route>
								<Route path='/token/:contract/:identifier' component={Token} />
								<Route path='/rair/:contract/:product' component={RairProduct} />
								<Route path='/all'>
									<VideoList />
								</Route>
								<Route path='/watch/:videoId/:mainManifest'>
									<VideoPlayer />
								</Route>
								{adminAccess && <Route path='/admin' component={FileUpload} />}
								<Route path='/ending' component={CSVParser} />
								<Route path='/new-factory' component={MyContracts} />
								<Route exact path='/'>
									<div className='col-6 text-left'>
										<h1 className='w-100' style={{textAlign: 'left'}}>
											Digital <b className='title'>Ownership</b>
											<br />
											Encryption
										</h1>
										<p className='w-100' style={{textAlign: 'left'}}>
											RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content
										</p>
									</div>
								</Route>
							</Switch>
						</div>
					</div>
					<div className='col-1 d-none d-xl-inline-block' />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
