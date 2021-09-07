import {useState, useEffect, useCallback} from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';

import headerLogo from './images/RAIR-Tech-Logo-POWERED BY-BLACK-2021.png';
import './App.css';
import * as ethers from 'ethers'

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

import CSVParser from './components/metadata/csvParser.jsx';

import CreatorMode from './components/creatorMode.jsx';
import ConsumerMode from './components/consumerMode.jsx';

import VideoList from './components/video/videoList.jsx';
import VideoPlayer from './components/video/videoPlayer.jsx';
import FileUpload from './components/video/videoUpload.jsx';

import MyNFTs from './components/nft/myNFT.jsx';
import Token from './components/nft/Token.jsx';
import RairProduct from './components/nft/rairCollection.jsx';

import MetamaskLogo from './images/metamask-fox.svg';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0x8CFB64bd8295372e532D7595cEf0b900c768e612',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0x1150A9D87EAb450ab83A3779Fe977cfdF9aEF45C'
	},
	'0x5': { // Ethereum Goerli
		factory: '0x69F0980e45ae2A3aC5254C7B3202E8fce5B0f84F',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0xb256E35Ad58fc9c57948388C27840CEBcd7cb991'
	},
	'0x13881': { // Matic Mumbai
		factory: '0x74278C22BfB1DCcc3d42F8b71280C25691E8C157',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0xE5c44102C354B97cbcfcA56F53Ea9Ede572a39Ba'
	}
}

const binanceTestnetData = {
	chainId: '0x61',
	chainName: 'Binance Testnet',
	nativeCurrency:
	{
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
	blockExplorerUrls: ['https://testnet.bscscan.com']
}

const klaytnBaobabData = {
	chainId: '0x3e9',
	chainName: 'Klaytn Baobab',
	nativeCurrency:
	{
		name: 'KLAY',
		symbol: 'KLAY',
		decimals: 18
	},
	rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
	blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
}

const polygonMumbaiData = {
	chainId: '0x13881',
	chainName: 'Matic Testnet Mumbai',
	nativeCurrency:
	{
		name: 'Matic token',
		symbol: 'tMATIC',
		decimals: 18
	},
	rpcUrls: ['https://rpc-mumbai.matic.today'],
	blockExplorerUrls: ['https://matic.network/']
}

const blockchains = [
	{chainData: binanceTestnetData, bootstrapColor: 'warning'},
	{chainData: klaytnBaobabData, bootstrapColor: 'light'},
	{chainData: {chainId: '0x3', chainName: 'Ropsten (Ethereum)'}, bootstrapColor: 'primary'},
	{chainData: {chainId: '0x5', chainName: 'Goerli (Ethereum)'}, bootstrapColor: 'secondary'},
	{chainData: polygonMumbaiData, bootstrapColor: 'danger'}
]

function App() {

	const [account, setAccount] = useState();
	const [chainId, setChainId] = useState();
	const [addresses, setAddresses] = useState();
	const [programmaticProvider, setProgrammaticProvider] = useState();
	const [refreshFlag, setRefreshFlag] = useState(false);
	const [userData, setUserData] = useState();
	const [adminAccess, setAdminAccess] = useState(undefined);

	const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState('');

	const connectUserData = useCallback(async () => {
		try {
			// Verifica si el usuario existe
			// Make sure the user exists
			const {success, user} = await (await fetch(`/api/users/${account}`)).json();
			if (!success || !user) {
				const userCreation = await fetch('/api/users', {
					method: 'POST',
					body: JSON.stringify({ publicAddress: account, adminNFT: 'temp' }),
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
			// Acceso de Administrador (para subir videos)
			let adminRights = adminAccess;
			if (adminAccess === undefined) {
				const { response } = await (await fetch(`/api/auth/get_challenge/${account}`)).json();
				const ethResponse = await window.ethereum.request({
					method: 'eth_signTypedData_v4',
					params: [account, response],
					from: account
				});
				const adminResponse = await (await fetch(`/api/auth/admin/${ JSON.parse(response).message.challenge }/${ ethResponse }/`)).json();
				setAdminAccess(adminResponse.success);
				adminRights = adminResponse.success;
			}

			// JWT validation
			// Verifica que la token exista
			if (!localStorage.token) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
					const msg = `Sign in for RAIR by nonce: ${ user.nonce }`;
					let signer = provider.getSigner();
					let signature = await (signer.signMessage(msg, account));
					const { token } = await (await fetch('/api/auth/authentication', {
					method: 'POST',
					body: JSON.stringify({ publicAddress: account, signature, adminRights: adminRights }),
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
	}, [account, adminAccess]);

	useEffect(() => {
		window.ethereum && window.ethereum.request({ method: 'eth_requestAccounts' })
			.then(accounts => {
				setAccount(accounts[0]);
				connectUserData();
			});
	}, [account, connectUserData])

	const connectProgrammatically = async ({rpcUrls, chainId, chainName, nativeCurrency}) => {
		try {
			let provider = new ethers.providers.JsonRpcProvider(rpcUrls[0], {
				chainId: Number(chainId), symbol: nativeCurrency.symbol, name: chainName, timeout: 1000000
			});
			let currentWallet = await new ethers.Wallet(UNSAFE_PrivateKey, provider);
			setChainId(chainId);
			setAddresses(contractAddresses[chainId]);
			setAccount(currentWallet.address);
			setProgrammaticProvider(currentWallet);
		} catch (err) {
			console.log(err);
			Swal.fire('Error', err, 'error');
		}
	}

	const switchEthereumChain = async (chainData) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainData.chainId }],
			});
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [chainData],
					});
				} catch (addError) {
					console.error(addError);
				}
			} else {
				console.error(switchError);
			}
		}
	}

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('chainChanged', async (chainId) => {
				setRefreshFlag(refreshFlag => !refreshFlag);
			});
		}
	}, [])

	useEffect(() => {
		if (window.ethereum) {
			setChainId(window.ethereum.chainId?.toLowerCase());
			setAddresses(contractAddresses[window.ethereum.chainId?.toLowerCase()]);
		}
	}, [refreshFlag])

	return (
		<BrowserRouter>
			<div style={{minHeight: '100vh', backgroundColor: '#EEE'}} className="App p-0 text-black container-fluid">
				<div className='row w-100 m-0 p-0'>
					<div className='col-1 d-none d-xl-inline-block' />
					<div className='col-1 rounded'>
						<div className='col-12 pt-2 mb-4' style={{height: '10vh'}}>
							<img alt='Header Logo' src={headerLogo} className='h-100'/>
						</div>
						{(!userData && account) ? <button className='btn btn-light' onClick={connectUserData}>
							Connect <img alt='Metamask Logo' src={MetamaskLogo} />
						</button> : [
							{name: <i className='fas fa-search' />, route: '/search'},
							{name: <i className='fas fa-user' />, route: '/user'},
							{name: 'My NFTs', route: '/my-nft'},
							{name: 'For Sale', route: '/on-sale'},
							{name: 'Admin', route: '/admin'},
							{name: 'All', route: '/all'},
							{name: 'Latest', route: '/latest'},
							{name: 'Hot', route: '/hot'},
							{name: 'Ending', route: '/ending'},
							{name: 'Factory', route: '/factory', disabled: contractAddresses[chainId] === undefined},
							{name: 'Minter Marketplace', route: '/minter', disabled: contractAddresses[chainId] === undefined}
						].map((item, index) => {
							if (!item.disabled) {
								return <div key={index} className='col-12 py-3 rounded bg-white'>
									<Link to={item.route} style={{color: 'inherit', textDecoration: 'none'}}>
										{item.name}
									</Link>
								</div>
							}
							return <div key={index}></div>
						})}
					</div>
					<div className='col'>
						<div className='col-12' style={{height: '10vh'}}>
							{account && `Connected with ${account}!`}<br />
							<Switch>
								<Route exact path='/admin'>
									{!window.ethereum && <div className='row py-5 w-100 px-0 mx-0'>
										<hr className='w-100' />
										<h5 className='col-12'> For tests only! </h5>
										<div className='col-1' />
										<input
											className='col-10 text-center'
											type='password'
											value={UNSAFE_PrivateKey}
											onChange={e => setUNSAFE_PrivateKey(e.target.value)}
										/>
										<div className='col-1' />
										<div className='col-12 text-center'>
											Use my private key to connect to
										</div>
										<div className='col-12'>
											{blockchains.map((item, index) => {
												if (!item.chainData.rpcUrls) {
													return <></>
												}
												return <button
													key={index}
													className={`btn btn-${item.bootstrapColor}`}
													disabled={chainId === item.chainData.chainId?.toLowerCase()}
													onClick={async e => {
														await connectProgrammatically(item.chainData);
													}}>
													{item.chainData.chainName}
												</button>
											})}
										</div>
										<hr className='w-100' />
									</div>}
									{window.ethereum && blockchains.map((item, index) => {
										return <button
											key={index}
											className={`btn btn-${item.bootstrapColor}`}
											disabled={chainId === item.chainData.chainId?.toLowerCase()}
											onClick={async e => {
												await switchEthereumChain(item.chainData);
												setAccount();
												setChainId();
											}}>
											{item.chainData.chainName}
										</button>
									})}
								</Route>
							</Switch>
						</div>
						<div className='col-12 mt-3 row'>
							<Switch>
								{addresses && <Route exact path='/factory'>
									<CreatorMode account={account} addresses={addresses} programmaticProvider={programmaticProvider}/>
								</Route>}
								{addresses && <Route exact path='/minter'>
									<ConsumerMode account={account} addresses={addresses} programmaticProvider={programmaticProvider}/>
								</Route>}
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
